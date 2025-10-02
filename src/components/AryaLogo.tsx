import React from 'react';
type AryaLogoProps = {
  className?: string;
};
export const AryaLogo = ({
  className = 'w-64 h-64'
}: AryaLogoProps) => {
  return <div className={`bg-black ${className}`}>
      <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* All diamonds share the same bottom point at (400, 700) */}
        {/* Large diamond */}
        <path d="M400 100L100 400L400 700L700 400L400 100Z" stroke="white" strokeWidth="40" strokeLinejoin="round" fill="none" />
        {/* Medium diamond */}
        <path d="M400 250L250 400L400 700L550 400L400 250Z" stroke="white" strokeWidth="40" strokeLinejoin="round" fill="none" />
        {/* Small diamond */}
        <path d="M400 400L325 475L400 700L475 475L400 400Z" stroke="white" strokeWidth="40" strokeLinejoin="round" fill="none" />
      </svg>
    </div>;
};