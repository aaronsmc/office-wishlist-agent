import React from 'react';
export const TypingIndicator = () => {
  return <div className="flex space-x-2 items-center">
      <div className="w-2 h-2 rounded-full bg-green-700 animate-pulse-glow"></div>
      <div className="w-2 h-2 rounded-full bg-green-700 animate-pulse-glow animation-delay-200"></div>
      <div className="w-2 h-2 rounded-full bg-green-700 animate-pulse-glow animation-delay-400"></div>
    </div>;
};