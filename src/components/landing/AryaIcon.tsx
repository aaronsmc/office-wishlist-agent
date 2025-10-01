import React from 'react';
interface AryaIconProps {
  className?: string;
}
export const AryaIcon: React.FC<AryaIconProps> = ({
  className
}) => {};
export const AryaIconLarge: React.FC<AryaIconProps> = ({
  className
}) => {
  return <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M50 5L95 50L50 95L5 50L50 5Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
};
export const AryaIconMedium: React.FC<AryaIconProps> = ({
  className
}) => {
  return <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M50 20L80 50L50 80L20 50L50 20Z" transform="translate(0,+25)" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
};
export const AryaIconSmall: React.FC<AryaIconProps> = ({
  className
}) => {
  return <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M50 35L65 50L50 65L35 50L50 35Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
};