import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
// translations accessible from LanguageContext
import { useSection } from '../context/SectionContext.jsx';
import { FaBars } from 'react-icons/fa';
import Logo from './Logo';

export default function Header() {
  const { currentSection, setCurrentSection } = useSection();
  const { lang, translations } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Section IDs and their display names based on selected language
  const tSec = translations[lang]?.sections || translations.en.sections;
  const sections = [
    { id: 'hero', name: tSec.hero },
    { id: 'services', name: tSec.services },
    { id: 'speed', name: tSec.speed },
    { id: 'damage', name: tSec.damage },
    { id: 'ceo', name: tSec.ceo },
    { id: 'testimonials', name: tSec.testimonials },
    { id: 'social', name: tSec.social },
    { id: 'contact', name: tSec.contact },
  ];

  useEffect(() => {
    const MIN_VISIBLE_RATIO = 0.3;
    const visibleRatios = {};

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          visibleRatios[id] = entry.intersectionRatio;
        } else {
          delete visibleRatios[id];
        }
      });

      // Determine which section is most visible
      let topId = null;
      let maxRatio = MIN_VISIBLE_RATIO;
      for (const [id, ratio] of Object.entries(visibleRatios)) {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          topId = id;
        }
      }

      if (topId) {
        const sec = sections.find(s => s.id === topId);
        if (sec) setCurrentSection(sec.name);
      }
    }, {
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    // Observe each section element
    sections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [lang]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center relative">
        <div className="flex items-center">
          <Logo />
          
        </div>
        <button 
          className="md:hidden text-2xl" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <span className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold">{currentSection}</span>
        </div>
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4`}>
          <ul className="flex flex-col md:flex-row md:space-x-8">
            {sections.map(sec => (
              <li key={sec.id}>
                <a href={`#${sec.id}`} className="block py-2 px-4 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  {sec.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

// NEW: Function to trigger animation
function triggerAnimation(sectionId) {
  // TO DO: Implement animation logic here
  console.log(`Triggering animation for section ${sectionId}`);
}
