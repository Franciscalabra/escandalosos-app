import React from 'react';

export const Loading = ({ color = '#f70295', size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const spinner = (
    <div 
      className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]}`}
      style={{ borderColor: color }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-20">
      {spinner}
    </div>
  );
};