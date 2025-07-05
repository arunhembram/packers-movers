import React from 'react';

/**
 * Simple gradient box logo with a single letter.
 * Replace the letter or styling as desired for a custom logo.
 */
export default function Logo({ className = '' }) {
  return (
    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-teal-400 flex items-center justify-center select-none ${className}`}>
      <span className="text-white text-lg font-extrabold tracking-tight">LOGO</span>
    </div>
  );
}
