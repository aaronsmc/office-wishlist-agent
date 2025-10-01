import React from 'react';
import { AryaIconLarge, AryaIconMedium, AryaIconSmall, AryaIcon } from './AryaIcon';
type HeroAnimationProps = {
  onComplete?: () => void;
};
export const HeroAnimation = ({
  onComplete
}: HeroAnimationProps) => {
  return <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      {/* Container for the animation with 3D perspective - reduced size by half */}
      <div className="relative w-32 h-32 transform-style-3d group">
        {/* Large diamond - positioned from the same corner */}
        <div className="absolute top-0 left-0 w-full h-full origin-top-left">
          <AryaIconLarge className="w-full h-full animate-diamond-large-loop group-hover:animate-diamond-large-loop-hover" />
        </div>
        {/* Medium diamond - positioned from the same corner */}
        <div className="absolute top-0 left-0 w-[85%] h-[85%] origin-top-left">
          <AryaIconMedium className="w-full h-full animate-diamond-medium-loop group-hover:animate-diamond-medium-loop-hover" />
        </div>
        {/* Small diamond - positioned from the same corner */}
        <div className="absolute top-0 left-0 w-[70%] h-[70%] origin-top-left">
          <AryaIconSmall className="w-full h-full animate-diamond-small-loop group-hover:animate-diamond-small-loop-hover" />
        </div>
        {/* Center icon that's always visible */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[60%] h-[60%]">
            {/* Glow effect behind the icon */}
            <div className="absolute inset-0 bg-white/5 rounded-full blur-xl transform scale-150 animate-glow-pulse-loop group-hover:animate-glow-pulse-loop-hover"></div>
            {/* Assembled icon */}
            <AryaIcon className="w-full h-full animate-icon-breathe group-hover:animate-icon-breathe-hover" />
          </div>
        </div>
      </div>
    </div>;
};