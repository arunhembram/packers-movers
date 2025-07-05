import React from 'react';
import { FaPhone } from 'react-icons/fa';

export default function FloatingButton() {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <a 
        href="tel:+15551234567"
        className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors duration-300 animate-pulse"
      >
        <FaPhone className="text-xl" />
      </a>
    </div>
  );
}
