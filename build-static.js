
import { build } from 'vite';
import fs from 'fs';
import path from 'path';

async function buildStatic() {
  console.log('Building static site...');
  
  try {
    // Build the React app
    await build();
    
    console.log('✅ Static site built successfully!');
    console.log('📁 Files are in the "dist" folder');
    console.log('🚀 You can now deploy the contents of the "dist" folder to any static hosting service');
    console.log('');
    console.log('To test locally:');
    console.log('  - Install a simple HTTP server: npm install -g http-server');
    console.log('  - Navigate to dist folder: cd dist');
    console.log('  - Start server: http-server');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildStatic();
