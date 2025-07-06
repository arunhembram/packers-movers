import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import './SuperFastDelivery.css';

export default function SuperFastDelivery({ id, className = '' }) {
  const { lang, translations } = useLanguage();
  const tFast = translations[lang]?.superFast || translations.en.superFast;
  const sectionRef = useRef(null);
  const [smilesCount, setSmilesCount] = useState(10000);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSmilesCount(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const startAnimation = () => {
    let currentSpeed = 0;
    let targetSpeed = 0;
    let odometer = 123456;
    let lastDisplayedOdometer = null;
    let isAccelerating = true;
    let animationRunning = false;
    let rafId;

    const speedMarks = document.getElementById('speedMarks');
    const speedNumbers = document.getElementById('speedNumbers');
    const needle = document.getElementById('needle');
    const speedDisplay = document.getElementById('speedDisplay');

    const initializeSpeedometer = () => {
      if (speedMarks.children.length) return; 
      for (let i = 0; i <= 120; i += 10) {
        const mark = document.createElement('div');
        mark.className = 'speed-mark major';
        const angle = -135 + (i / 120) * 270;
        mark.style.transform = `rotate(${angle}deg)`;
        speedMarks.appendChild(mark);

        const number = document.createElement('div');
        number.className = 'speed-number';
        number.textContent = i;
        const radius = 110;
        const angleRad = (angle * Math.PI) / 180;
        const x = 150 + radius * Math.sin(angleRad);
        const y = 150 - radius * Math.cos(angleRad);
        number.style.left = `${x - 10}px`;
        number.style.top = `${y - 10}px`;
        speedNumbers.appendChild(number);
      }
      for (let i = 5; i <= 115; i += 10) {
        const mark = document.createElement('div');
        mark.className = 'speed-mark';
        const angle = -135 + (i / 120) * 270;
        mark.style.transform = `rotate(${angle}deg)`;
        speedMarks.appendChild(mark);
      }
    };

    const updateSpeedometer = () => {
      const angle = -135 + (currentSpeed / 120) * 270;
      needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      speedDisplay.textContent = `${Math.round(currentSpeed)} km/h`;
    };

    const updateOdometer = () => {
      const odometerValue = Math.floor(odometer);
      if (odometerValue === lastDisplayedOdometer) return;
      lastDisplayedOdometer = odometerValue;
      const digits = odometerValue.toString().padStart(6, '0');

      for (let i = 0; i < 6; i++) {
        const digitWheel = document.getElementById(`digit${i}`);
        const digit = parseInt(digits[5 - i], 10);

        digitWheel.style.transition = 'transform 0.2s ease-in-out';
        digitWheel.style.transform = `translateY(-${digit * 40}px)`;
      }
    };

    const animate = () => {
      if (!animationRunning) return;
      if (isAccelerating) {
        if (currentSpeed < 100) {
          currentSpeed += 0.8;
          if (currentSpeed >= 100) {
            isAccelerating = false;
            targetSpeed = 50 + Math.random() * 50;
          }
        }
      } else {
        const diff = targetSpeed - currentSpeed;
        currentSpeed += diff * 0.03;
        if (Math.abs(diff) < 0.5) {
          targetSpeed = 50 + Math.random() * 50;
        }
      }
      const speedFactor = currentSpeed / 100;
      odometer += speedFactor * 0.3;
      updateSpeedometer();
      updateOdometer();
      rafId = requestAnimationFrame(animate);
    };

    initializeSpeedometer();
    updateOdometer();
    animationRunning = true;
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  };

  return (
    <section ref={sectionRef} id={id} className={`py-4 sm:py-24 bg-gray-950 flex justify-center ${className}`}>
      <div className="dashboard-wrapper">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">{tFast.title}</h2>
        <p className="text-gray-300 max-w-xl text-center mb-8 text-lg sm:text-base">{tFast.subtitle}</p>
        <p className="text-gray-400 text-lg sm:text-sm text-center italic mt-2">{tFast.note}</p>
        <div className="speedometer-container">
          <div className="speedometer">
            <div className="speed-marks" id="speedMarks" />
            <div className="speed-numbers" id="speedNumbers" />
            <div className="needle" id="needle" />
            <div className="speed-display" id="speedDisplay">0 km/h</div>
          </div>
        </div>
        <div className="odometer-container">
          <div className="odometer-label text-lg sm:text-base">{tFast.odometerLabel}</div>
          <div className="flex items-center justify-center">
            <div className="odometer" id="odometer">
              {String(smilesCount).split('').map((digit, i) => (
                <div className="digit-container" key={i}>
                  <div className="digit">{digit}</div>
                </div>
              ))}
            </div>
            <div className="plus-icon ml-2 text-green-500 animate-pulse">
              <i className="fas fa-plus" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
