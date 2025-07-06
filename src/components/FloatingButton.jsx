import React from 'react';
import './FloatingButton.css';

export default function FloatingButton() {
  return (
    <div className="fixed bottom-5 left-5 md:bottom-6 md:left-6 z-50">
      <a 
        href="tel:+916291270166"
        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300 jump-shake"
      >
        <i className="fas fa-phone-alt text-lg md:text-xl transform scale-x-[-1]" aria-hidden="true"></i>
      </a>
    </div>
  );
}
