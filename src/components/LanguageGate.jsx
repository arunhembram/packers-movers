import React, { useState, useEffect, useRef } from 'react';
import './LanguageGate.css';

const countdownTexts = {
  en: { title: 'Thank You', subtitle: 'Opening Demo Site...' },
  bn: { title: 'ধন্যবাদ', subtitle: 'ডেমো সাইট খোলা হচ্ছে...' },
  hi: { title: 'धन्यवाद', subtitle: 'डेमो साइट खोली जा रही है...' }
};

import { LanguageProvider } from '../context/LanguageContext.jsx';
export default function LanguageGate({ children, translations }) {
  const [stage, setStage] = useState('language'); // 'language' | 'countdown' | 'done'
  const [language, setLanguage] = useState('en');
  const [count, setCount] = useState(3);
  const progressRef = useRef(null);

  // Handle countdown effect
  useEffect(() => {
    if (stage !== 'countdown') return;

    // reset values
    setCount(3);
    if (progressRef.current) progressRef.current.style.width = '0%';

    const interval = setInterval(() => {
      setCount(prev => {
        const next = prev - 1;
        const progress = (3 - next) * 33.33;
        if (progressRef.current) progressRef.current.style.width = `${progress}%`;

        if (next <= 0) {
          clearInterval(interval);
          // brief pause before hiding overlay
          setTimeout(() => setStage('done'), 1000);
          
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  // Keyboard navigation for language buttons
  useEffect(() => {
    if (stage !== 'language') return;

    const handleKey = e => {
      const buttons = Array.from(document.querySelectorAll('.language-button'));
      const idx = buttons.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && idx < buttons.length - 1) {
        e.preventDefault();
        buttons[idx + 1].focus();
      } else if (e.key === 'ArrowUp' && idx > 0) {
        e.preventDefault();
        buttons[idx - 1].focus();
      } else if (e.key === 'Enter' && idx !== -1) {
        buttons[idx].click();
      } else if (e.key === 'Escape') {
        setStage('done');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stage]);

  const handleSelectLanguage = code => {
    setLanguage(code);
    setStage('countdown');
  };

  return (
    <LanguageProvider lang={language} translations={translations}>
      <>
      {/* Overlays and decorations */}
      {stage !== 'done' && (
        <>
          <div className="bg-decoration"></div>
          <div className="bg-decoration"></div>
          <div className="bg-decoration"></div>
          <div className="bg-decoration"></div>
        </>
      )}

      {stage === 'language' && (
        <div className="language-overlay">
          <div className="language-card">
            <div className="language-header">Build Your Website<br />in Your Language</div>
            <div className="language-buttons">
              <button className="language-button" onClick={() => handleSelectLanguage('en')}>English</button>
              <button className="language-button" onClick={() => handleSelectLanguage('bn')}>বাংলা</button>
              <button className="language-button" onClick={() => handleSelectLanguage('hi')}>हिन्दी</button>
            </div>
          </div>
        </div>
      )}

      {stage === 'countdown' && (
        <div className="countdown-overlay show">
          <div className="countdown-card">
            <div className="countdown-title">{countdownTexts[language].title}</div>
            <div className="countdown-subtitle">{countdownTexts[language].subtitle}</div>
            <div className="countdown-number">{count}</div>
            <div className="countdown-progress">
              <div className="countdown-progress-bar" ref={progressRef}></div>
            </div>
            <div className="countdown-dots">
              <div className="countdown-dot"></div>
              <div className="countdown-dot"></div>
              <div className="countdown-dot"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main site */}
      {children}
      </>
    </LanguageProvider>
  );
}
