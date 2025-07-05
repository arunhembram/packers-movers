import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const SocialMediaSlider = ({ id = 'social', className = '' }) => {
  const { lang, translations } = useLanguage();
  const tSocial = translations[lang]?.socialMedia || translations.en.socialMedia;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef(null);

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com',
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-500/20'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com',
      color: 'from-pink-600 to-purple-800',
      bgColor: 'bg-pink-500/20'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com',
      color: 'from-red-600 to-red-800',
      bgColor: 'bg-red-500/20'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com',
      color: 'from-cyan-600 to-blue-800',
      bgColor: 'bg-cyan-500/20'
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: 'https://wa.me/1234567890',
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-500/20'
    }

  ];

  // Auto-play functionality with infinite scroll
  useEffect(() => {
    if (!isAutoPlay || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % socialPlatforms.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlay, isDragging, socialPlatforms.length]);

  // Handle drag start (mouse & touch)
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setIsAutoPlay(false);
    setStartX(clientX);
    setCurrentX(clientX);
    setDragOffset(0);
  };

  // Handle drag move (mouse & touch)
  const handleDragMove = (clientX) => {
    if (!isDragging) return;

    const diff = clientX - startX;
    setCurrentX(clientX);
    setDragOffset(diff);
  };

  // Handle drag end (mouse & touch) with infinite scroll
  const handleDragEnd = () => {
    if (!isDragging) return;

    const diff = currentX - startX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Dragging right - go to previous (with infinite scroll)
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? socialPlatforms.length - 1 : prevIndex - 1
        );
      } else {
        // Dragging left - go to next (with infinite scroll)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % socialPlatforms.length);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const handleIconClick = (url) => {
    window.open(url, '_blank');
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  return (
    <div id={id} className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-8 ${className}`}>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {tSocial.header}
          </h1>
          <p className="text-gray-300 text-sm sm:text-lg">{tSocial.subtitle}</p>
        </div>

        {/* Main Slider Container */}
        <div className="relative">
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/10"></div>

          {/* Slider - Added extra padding for mobile tooltips */}
          <div
            ref={sliderRef}
            className="relative p-4 sm:p-8 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Icons Container with extra height for mobile tooltips */}
            <div className="relative h-48 sm:h-40 flex items-center justify-center overflow-visible">
              {/* Render icons with infinite scroll positioning */}
              {socialPlatforms.map((platform, index) => {
                const IconComponent = platform.icon;
                const isCenter = index === currentIndex;

                // Calculate position with infinite scroll
                let relativePosition = index - currentIndex;

                // Handle infinite scroll positioning
                if (relativePosition > socialPlatforms.length / 2) {
                  relativePosition -= socialPlatforms.length;
                } else if (relativePosition < -socialPlatforms.length / 2) {
                  relativePosition += socialPlatforms.length;
                }

                const offset = relativePosition * 80; // 80px spacing between icons
                const dragTransform = isDragging ? dragOffset * 0.5 : 0;

                // Calculate scale and opacity based on distance from center
                const distanceFromCenter = Math.abs(relativePosition);
                let scale = 1;
                let opacity = 1;

                if (isCenter) {
                  scale = 1.8; // Bigger center icon
                  opacity = 1;
                } else if (distanceFromCenter === 1) {
                  scale = 1.2;
                  opacity = 0.8;
                } else if (distanceFromCenter === 2) {
                  scale = 1;
                  opacity = 0.6;
                } else {
                  scale = 0.8;
                  opacity = 0.3;
                }

                // Only render visible icons (within reasonable distance)
                if (distanceFromCenter > 3) return null;

                return (
                  <div
                    key={platform.name}
                    className={`absolute transition-all duration-500 ease-out transform hover:scale-110 ${
                      isCenter ? 'z-20' : 'z-10'
                    }`}
                    style={{
                      transform: `translateX(${offset + dragTransform}px) translateY(${isCenter ? -8 : 0}px) scale(${scale})`,
                      opacity: opacity
                    }}
                  >
                    {/* Glow Effect for Center Icon */}
                    {isCenter && (
                      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r ${platform.color} opacity-40 blur-lg scale-150`}></div>
                    )}

                    {/* Icon Background */}
                    <div
                      className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                        isCenter
                          ? `${platform.bgColor} border-white/40 shadow-2xl shadow-white/20`
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => !isDragging && handleIconClick(platform.url)}
                    >
                      <IconComponent
                        size={isCenter ? 32 : 24}
                        className={`transition-all duration-300 ${
                          isCenter ? `text-white drop-shadow-lg` : 'text-gray-300 hover:text-white'
                        }`}
                      />
                    </div>

                    {/* Tooltip - Better mobile positioning */}
                    <div
                      className={`absolute top-full mt-3 sm:mt-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-30 ${
                        isCenter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <div className="bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg border border-white/10">
                        {platform.name}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 sm:mt-8 gap-2">
            {socialPlatforms.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white w-6 sm:w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <div className="text-center mt-4 sm:mt-6">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="text-white/70 hover:text-white text-sm transition-colors duration-300"
            >
              {isAutoPlay ? `⏸️ ${tSocial.pause}` : `▶️ ${tSocial.play}`} {tSocial.autoScroll}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-12 text-gray-400">
          <p className="text-sm">{tSocial.footer}</p>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSlider;
