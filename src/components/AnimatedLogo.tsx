import React, { useState } from 'react';
type AnimatedLogoProps = {
  className?: string;
  showAnimation?: boolean;
};
export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  className = 'h-12',
  showAnimation = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  // Use the new logo URL
  const logoUrl = "/Line_Stack__Name_Health__Color_black-removebg-preview.png";
  return <div className={`relative ${className} flex items-center justify-center`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Always use light mode logo */}
      <img src={logoUrl} alt="ARYA HEALTH" className="relative z-10 h-full" />
      {/* Animated glow effects - only visible when animation is enabled */}
      {showAnimation && <>
          {/* Green glow for light mode - more subtle now */}
          <div className={`absolute inset-0 scale-75 bg-green-500 rounded-full blur-xl 
              ${isHovered ? 'animate-glow-pulse-fast opacity-5' : 'animate-glow-pulse opacity-3'}`} />
          {/* Emerald glow - more subtle now */}
          <div className={`absolute inset-0 scale-75 bg-emerald-500 rounded-full blur-xl 
              ${isHovered ? 'animate-glow-pulse-fast opacity-5 animation-delay-500' : 'animate-glow-pulse opacity-3 animation-delay-500'}`} />
          {/* Teal glow - more subtle now */}
          <div className={`absolute inset-0 scale-75 bg-teal-500 rounded-full blur-xl 
              ${isHovered ? 'animate-glow-pulse-fast opacity-5 animation-delay-1000' : 'animate-glow-pulse opacity-3 animation-delay-1000'}`} />
          {/* Subtle color shimmer overlay - reduced opacity */}
          <div className={`absolute inset-0 scale-60 bg-gradient-to-r from-green-500/0 via-emerald-500/3 to-teal-500/0 rounded-lg blur-xl ${isHovered ? 'animate-shimmer-fast' : 'animate-shimmer'}`} />
        </>}
    </div>;
};