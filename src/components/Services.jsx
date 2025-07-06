import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useSection } from '../context/SectionContext.jsx';

// New imports for service images
import goodsShippingImage from '../assets/images/services/goods-shipping.jpg';
import translations from '../i18n/translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import carShippingImage from '../assets/images/services/car-shipping.jpg';
import bikeShippingImage from '../assets/images/services/bike-shipping.jpg';
import factoryRelocationImage from '../assets/images/services/factory-relocation.jpg';
import machineryShippingImage from '../assets/images/services/machinery-shipping.jpg';

export default function Services() {
  const { setCurrentSection } = useSection();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [hasAdvanced, setHasAdvanced] = useState(false); // Track if we've already advanced
  const [cardSpacing, setCardSpacing] = useState(160); // Dynamic card spacing
  const [isMobile, setIsMobile] = useState(false); // Initialize in useEffect
  
  const carouselRef = useRef(null);
  const sectionRef = useRef(null);
  const autoPlayRef = useRef();
  
  const { lang } = useLanguage();
  const tServices = translations[lang]?.services || translations.en.services;
  const headerTitle = translations[lang]?.servicesHeader || translations.en.servicesHeader;
  const services = tServices.map((s, idx) => ({
    ...s,
    image: [goodsShippingImage, carShippingImage, bikeShippingImage, factoryRelocationImage, machineryShippingImage][idx]
  }));

  const sectionName = translations[lang]?.sections.services || translations.en.sections.services;
 

  const totalServices = services.length;
  const swipeThreshold = 50; // Minimum distance to trigger swipe

  // Intersection Observer to update current section in header
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentSection(sectionName);
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setCurrentSection]);

  // Update responsive settings
  useEffect(() => {
    const updateResponsive = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      const newCardSpacing = mobile ? 140 : 180; // Reduced spacing for narrower mobile cards
      setCardSpacing(newCardSpacing);
    };

    updateResponsive();
    window.addEventListener('resize', updateResponsive);
    return () => window.removeEventListener('resize', updateResponsive);
  }, []);

  // Memoized autoplay functions
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    
    const autoplayInterval = 2000; // 2s per card
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalServices);
    }, autoplayInterval);
  }, [totalServices, isMobile]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // Autoplay management - only start/stop when dragging begins or ends
  useEffect(() => {
    if (isDragging) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
    return stopAutoPlay;
  }, [isDragging, startAutoPlay, stopAutoPlay]);

  // Calculate card positioning and styling
  const getCardStyle = useCallback((serviceIndex) => {
    // 1) Compute base relative position
    let relativePosition = serviceIndex - currentIndex;
    
    // Handle wrap-around for infinite effect
    if (relativePosition > totalServices / 2) {
      relativePosition -= totalServices;
    } else if (relativePosition < -totalServices / 2) {
      relativePosition += totalServices;
    }
    
    // Special handling for first/last card transitions
    if (currentIndex === totalServices - 1 && serviceIndex === 0) {
      relativePosition = 1; // First card comes from right after last card
    } else if (currentIndex === 0 && serviceIndex === totalServices - 1) {
      relativePosition = -1; // Last card comes from left after first card
    }
    
    // Clamp relative position to prevent excessive movement
    const maxSpread = isMobile ? 2.5 : 3.5; // Limit how far cards spread
    const clampedPosition = Math.max(-maxSpread, Math.min(maxSpread, relativePosition));
    
    // 2) Apply drag influence with clamping to prevent excessive movement
    const maxDragInfluence = 0.8; // Limit how much drag affects position
    const dragInfluence = Math.max(-maxDragInfluence, Math.min(maxDragInfluence, dragOffset / cardSpacing));
    const finalPosition = isDragging ? clampedPosition + dragInfluence : clampedPosition; 
    const absPosition = Math.abs(finalPosition);
    
    // 3) Styling buckets with wider center threshold - NO ROTATION
    let transform = '';
    let zIndex = 10;
    let opacity = 1;
    
    const scaleFactor = 1.0;  // same on all devices
    const opacityFactor = 1.0;
    const translationFactor = 1.0;
    const translation = finalPosition * cardSpacing * translationFactor;
    
    if (absPosition > 2) {
      return {
        opacity: 0,
        transform: `scale(0)`,
        zIndex: 0,
      };
    }
    
    if (absPosition < 0.5) { // wider center threshold
      transform = `translateX(${finalPosition * cardSpacing * scaleFactor}px) scale(${scaleFactor})`;
      zIndex = 30; // Higher for center
    } else if (absPosition <= 1) {
      transform = `translateX(${finalPosition * cardSpacing * scaleFactor}px) scale(${0.9 * scaleFactor})`;
      opacity = opacityFactor * (1 - 0.2 * absPosition);
      zIndex = 10; // Lower for sides
    } else {
      transform = `translateX(${finalPosition * cardSpacing * scaleFactor}px) scale(${0.8 * scaleFactor})`;
      opacity = opacityFactor * (0.8 - 0.3 * (absPosition - 1));
      zIndex = 0;
    }

    return {
      transform,
      zIndex,
      opacity,
      transition: 'transform 0.4s ease, opacity 0.3s ease',
    };
  }, [currentIndex, dragOffset, totalServices, cardSpacing, isMobile]);

  // Unified drag handlers
  const handleDragStart = useCallback((e, index) => {
    e.preventDefault();
    setIsDragging(true);
    setHasAdvanced(false); // Reset advancement flag
    
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    setStartX(clientX);
    
    
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const diff = clientX - startX;
    
    // Update drag offset for visual feedback
    /* index update handled on drag end */
    
    // Clamp drag distance for smoother feel
    const clampedDiff = Math.max(-cardSpacing * 1.5, Math.min(cardSpacing * 1.5, diff));
    setDragOffset(clampedDiff * 0.8);
  }, [isDragging, startX, hasAdvanced, swipeThreshold, totalServices, cardSpacing]);
  
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    const threshold = 30;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset < 0) {
        setCurrentIndex(prev => (prev + 1) % totalServices);
      } else {
        setCurrentIndex(prev => (prev - 1 + totalServices) % totalServices);
      }
    }
    setIsDragging(false);
    setDragOffset(0);
    // restart autoplay handled by existing effects
  }, [isDragging, dragOffset, totalServices]);

  // Global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const handleMove = (e) => {
        e.preventDefault();
        handleDragMove(e);
      };
      
      const handleEnd = () => {
        handleDragEnd();
      };

      // Add event listeners
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      document.addEventListener('mouseleave', handleEnd);
      document.addEventListener('touchcancel', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
        document.removeEventListener('mouseleave', handleEnd);
        document.removeEventListener('touchcancel', handleEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);
  
  const goToSlide = useCallback((index) => {
    stopAutoPlay();
    setCurrentIndex(index);
    setDragOffset(0);
    // Restart autoplay after manual navigation
    setTimeout(() => {
      if (!isDragging) {
        startAutoPlay();
      }
    }, 100);
  }, [isDragging, startAutoPlay, stopAutoPlay]);

  const handleBookNow = useCallback((serviceName) => {
    alert(`Booking ${serviceName} - This would open a booking form or navigate to booking page`);
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="services" 
      className="min-h-screen bg-gray-900 py-2 sm:py-4 overflow-hidden flex flex-col"
    >
      {/* Header Section */}
      <div className="w-full mb-0 pt-8 mt-16 sm:mt-8">
        <h2 className="text-3xl font-bold text-center text-white mb-0">
          {headerTitle}
        </h2>
      </div>
      
      {/* Card Container Section */}
      <div className="flex-1 flex items-center justify-center mt-[-46.8rem] sm:mt-0">
        <div 
          className="relative w-full max-w-6xl h-96 sm:h-[30rem] flex justify-center items-center mx-auto" 
          style={{ 
            perspective: '1000px',
            touchAction: 'pan-y',
            userSelect: 'none'
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            handleDragMove(e);
          }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="absolute w-64 max-w-[90vw] sm:w-80 md:w-96 h-auto bg-white rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing transition-shadow duration-200 hover:shadow-3xl"
              style={{
                ...getCardStyle(index)
              }}
              onMouseDown={(e) => handleDragStart(e, index)}
              onTouchStart={(e) => handleDragStart(e, index)}
            >
              <div className="w-full h-full p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden bg-white rounded-xl">
                {/* Service image area */}
                <div className="relative w-full aspect-square overflow-hidden rounded-t-lg mb-6 sm:mb-8 md:mb-6">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Service details */}
                <div className="mt-4 flex flex-col items-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                  <p className="text-gray-800 text-center mb-4">{service.description}</p>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => handleBookNow(service.name)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Navigation Section */}
      <div className="w-full mt-[-45rem] sm:mt-8">
        <div className="flex justify-center space-x-3">
          {services.map((_, index) => (
            <button
              key={index}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}