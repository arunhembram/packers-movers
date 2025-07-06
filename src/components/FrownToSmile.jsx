import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import './FrownToSmile.css';
import './HeroSectionClean.css';

const FrownToSmile = ({ id, className = '' }) => {
  const { lang, translations } = useLanguage();
  const tHero = translations[lang]?.hero || translations.en.hero;


  // Restart animation exactly as in original script
  const restartAnimation = () => {
    const emoji = document.querySelector('.emoji');
    const face = document.querySelector('.face');
    const eyes = document.querySelectorAll('.eye');
    const upperEyelids = document.querySelectorAll('.upper-eyelid');
    const lowerEyelids = document.querySelectorAll('.lower-eyelid');
    const mouth = document.querySelector('.mouth');
    const teeth = document.querySelector('.teeth');

    // Remove all animations
    emoji.style.animation = 'none';
    face.style.animation = 'none';
    eyes.forEach(eye => (eye.style.animation = 'none'));
    upperEyelids.forEach(eyelid => (eyelid.style.animation = 'none'));
    lowerEyelids.forEach(eyelid => (eyelid.style.animation = 'none'));
    mouth.style.animation = 'none';
    teeth.style.animation = 'none';

    // Force reflow
    /* eslint-disable no-unused-expressions */
    emoji.offsetHeight;
    /* eslint-enable no-unused-expressions */

    // Restart animations
    emoji.style.animation = 'bounce 2.5s ease-in-out forwards';
    emoji.style.animationDelay = '1.5s';

    face.style.animation = 'finalGlow 3s ease-in-out infinite';
    face.style.animationDelay = '4s';

    eyes.forEach(eye => {
      eye.style.animation = 'synchronizedBlink 4s ease-in-out infinite';
      eye.style.animationDelay = '2s';
    });

    upperEyelids.forEach(eyelid => {
      eyelid.style.animation = 'eyelidBlink 4s ease-in-out infinite';
      eyelid.style.animationDelay = '2s';
    });

    lowerEyelids.forEach(eyelid => {
      eyelid.style.animation = 'lowerEyelidBlink 4s ease-in-out infinite';
      eyelid.style.animationDelay = '2s';
    });

    mouth.style.animation = 'mouthTransform 3s ease-in-out forwards';
    mouth.style.animationDelay = '0.8s';

    teeth.style.animation = 'teethReveal 2s ease-in-out forwards';
    teeth.style.animationDelay = '1.8s';

    // Restart individual tooth animations
    const individualTeeth = document.querySelectorAll('.tooth');
    individualTeeth.forEach((tooth, index) => {
      tooth.style.animation = 'none';
      /* eslint-disable no-unused-expressions */
      tooth.offsetHeight;
      /* eslint-enable no-unused-expressions */
      tooth.style.animation = 'teethDrop 2s ease-in-out forwards';
      const delays = ['1.8s', '1.9s', '2.0s', '2.1s', '2.0s', '1.9s', '1.8s'];
      tooth.style.animationDelay = delays[index];
    });
  };

  const [count, setCount] = useState(999);

  useEffect(() => {
    // Listen for overlay completion to restart animations
    const handleOverlayDone = () => {
      restartAnimation(); // restart emoji bounce/glow when overlay ends
      // Restart floating box animations
      const boxes = document.querySelectorAll('.box');
      boxes.forEach(box => {
        box.style.animation = 'none';
        /* eslint-disable no-unused-expressions */
        box.offsetHeight;
        /* eslint-enable no-unused-expressions */
        box.style.animation = 'float 12s linear infinite';
      });
    };
    window.addEventListener('overlayDone', handleOverlayDone);
    return () => window.removeEventListener('overlayDone', handleOverlayDone);
  }, []);

  useEffect(() => {
    const target = 9999;
    let current = 999;
    const fastIncrement = 1; // value added every tick during initial count-up
    const fastInterval = 3000; // ms per tick

    let fastTimer = setInterval(() => {
      current += fastIncrement;
      if (current >= target) {
        current = target;
        clearInterval(fastTimer);
        setCount(current);
        // After reaching target, continue slow incremental growth
        const slowTimer = setInterval(() => {
          current += 1;
          setCount(current);
        }, 2000);
        // Cleanup
        return () => clearInterval(slowTimer);
      }
      setCount(current);
    }, fastInterval);

    return () => clearInterval(fastTimer);
  }, []);


  return (
    <section id={id} className={`hero-section relative flex flex-col md:flex-row items-center justify-center min-h-[80vh] md:min-h-screen pt-16 md:pt-24 px-4 ${className}`}>
    {/* Animated Hero Background */}
      <div className="hero-background">
        <div className="cityscape">
          <div className="building" />
          <div className="building" />
          <div className="building" />
          <div className="building" />
          <div className="building" />
          <div className="building" />
        </div>
        <div className="location-pin" />
      </div>
      <div className="floating-boxes">
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
      </div>
      <div className="moving-strip">
        <div className="moving-item" />
        <div className="moving-item" />
        <div className="moving-item" />
        <div className="moving-item" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center">
      <div className="emoji-container" onClick={restartAnimation}>
        <div className="emoji">
          <div className="face">
            <div className="eye left">
              <div className="eye-shine" />
              <div className="upper-eyelid" />
              <div className="lower-eyelid" />
            </div>
            <div className="eye right">
              <div className="eye-shine" />
              <div className="upper-eyelid" />
              <div className="lower-eyelid" />
            </div>
            <div className="mouth-container">
              <div className="teeth">
                <div className="tooth" />
                <div className="tooth" />
                <div className="tooth" />
                <div className="tooth" />
                <div className="tooth" />
                <div className="tooth" />
                <div className="tooth" />
              </div>
              <div className="mouth" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:ml-12 mt-4 md:mt-0">
      <h1 className="text-4xl md:text-6xl font-bold text-white text-center md:text-left">{tHero.title}</h1>

      <p className="mt-4 text-xl md:text-2xl text-white text-center md:text-left">
        {tHero.subtitle.replace('{{count}}', count.toLocaleString())}
      </p>
      <p className="mt-2 text-sm md:text-base text-white text-center md:text-left opacity-80">
        {tHero.engagement}
      </p>
      </div>


    </div>
    </section>
  );
};

export default FrownToSmile;
