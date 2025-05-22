
import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const LottieAnimation = ({ 
  animationData, 
  loop = true, 
  autoplay = true,
  className = "w-full max-w-lg mx-auto",
  style
}: LottieAnimationProps) => {
  return (
    <div className={`lottie-container ${className}`} style={style}>
      <Lottie 
        animationData={animationData} 
        loop={loop} 
        autoplay={autoplay} 
      />
    </div>
  );
};

export default LottieAnimation;
