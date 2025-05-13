
export const extractDominantColor = (imgElement: HTMLImageElement): Promise<string> => {
  return new Promise((resolve) => {
    // Create a canvas element to draw the image
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to a small size for faster processing
    const width = 50;
    const height = 50;
    canvas.width = width;
    canvas.height = height;
    
    // Draw image onto canvas
    if (context) {
      context.drawImage(imgElement, 0, 0, width, height);
      
      // Get image data
      const imageData = context.getImageData(0, 0, width, height).data;
      
      // Create object to store color counts
      type ColorCount = {
        [key: string]: number;
      };
      const colorCount: ColorCount = {};
      
      // Process each pixel
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        
        // Skip transparent pixels
        const a = imageData[i + 3];
        if (a < 128) continue;
        
        // Convert to hex
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        
        // Count occurrences
        colorCount[hex] = (colorCount[hex] || 0) + 1;
      }
      
      // Find the most common color
      let dominantColor = '#f5f5f5'; // Default fallback color
      let maxCount = 0;
      
      Object.entries(colorCount).forEach(([color, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantColor = color;
        }
      });
      
      // Return the dominant color
      resolve(dominantColor);
    } else {
      // Fallback if canvas context isn't available
      resolve('#f5f5f5');
    }
  });
};

export const getDarkenedColor = (hex: string, amount: number = 0.1): string => {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Darken each component
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));
  
  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const getLightenedColor = (hex: string, amount: number = 0.1): string => {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Lighten each component
  r = Math.min(255, Math.floor(r + (255 - r) * amount));
  g = Math.min(255, Math.floor(g + (255 - g) * amount));
  b = Math.min(255, Math.floor(b + (255 - b) * amount));
  
  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};
