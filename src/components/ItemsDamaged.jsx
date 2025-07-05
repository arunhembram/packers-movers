import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import './ItemsDamaged.css';

export default function ItemsDamaged({ id = 'items-damaged', className = '' }) {
  const { lang, translations } = useLanguage();
  const tDamage = translations[lang]?.itemsDamaged || translations.en.itemsDamaged;

  useEffect(() => {
    let hasAnimated = false;
    let animationFrame;
    const startValue = 499;

    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const animateCountdown = () => {
      if (hasAnimated) return;
      const numberElement = document.getElementById('metricNumber');
      const celebration = document.getElementById('celebration');
      const duration = 4000; // 4s
      const startTime = Date.now();
      hasAnimated = true;

      const updateNumber = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = Math.round(startValue * (1 - easedProgress));
        numberElement.textContent = currentValue;

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateNumber);
        } else {
          numberElement.textContent = '0';
          setTimeout(() => {
            const card = document.getElementById('metricCard');
            const title = document.querySelector('.metric-title');
            const badge = document.querySelector('.trust-badge');
            numberElement.classList.add('final');
            card.classList.add('expanded');
            title.classList.add('pushed');
            badge.classList.add('pushed');
            setTimeout(() => celebration.classList.add('active'), 200);
          }, 100);
          setTimeout(() => celebration.classList.remove('active'), 2000);
        }
      };
      updateNumber();
    };

    // reset not used currently but kept for completeness
    const resetAnimation = () => {
      hasAnimated = false;
      const numberElement = document.getElementById('metricNumber');
      const celebration = document.getElementById('celebration');
      const card = document.getElementById('metricCard');
      const title = document.querySelector('.metric-title');
      const badge = document.querySelector('.trust-badge');
      if (animationFrame) cancelAnimationFrame(animationFrame);
      numberElement.textContent = startValue;
      numberElement.classList.remove('final');
      card.classList.remove('expanded');
      title.classList.remove('pushed');
      badge.classList.remove('pushed');
      celebration.classList.remove('active');
      setTimeout(() => animateCountdown(), 100);
    };

    // intersection observer
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          animateCountdown();
        }
      });
    }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });

    observer.observe(document.getElementById('metricCard'));

    // accessibility
    document.getElementById('metricNumber')?.setAttribute('aria-label', 'Items damaged or missing count');

    return () => {
      observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section id={id} className={`items-damaged-section py-16 flex justify-center ${className}`}>
      <div className="demo-container">
        <div className="demo-text">
          <h1>{tDamage.header}</h1>
          <p>{tDamage.subtitle}</p>
        </div>
        <div className="metric-card" id="metricCard">
          <div className="metric-title">{tDamage.safetyTitle}</div>
          <div className="metric-number" id="metricNumber" aria-live="polite">499</div>
          <div className="celebration" id="celebration" role="img" aria-label="celebration emoji">🎉</div>
          <div className="trust-badge">{tDamage.badge}</div>
        </div>
      </div>
    </section>
  );
}
