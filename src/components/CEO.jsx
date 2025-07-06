import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Award, Users, Shield, Eye, Trophy, Handshake, Brain } from 'lucide-react';
import { useSection } from '../context/SectionContext.jsx';
import ceoImage from '../assets/images/ceo/ceo.jpeg';

// CEO / Founder presentation section with animated achievements
const CEO = () => {
  const { lang, translations } = useLanguage();
  const tCeo = translations[lang]?.ceo || translations.en.ceo;
  const tSec = translations[lang]?.sections || translations.en.sections;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { setCurrentSection } = useSection();

  /* ------------------ VISIBILITY OBSERVER ------------------ */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setCurrentSection(tSec.ceo);
          observer.disconnect(); // run once
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setCurrentSection]);

  /* ------------------ DATA ------------------ */
    const achievements = [
    { icon: <Trophy className="w-5 h-5 text-yellow-500" />, text: tCeo.achievements[0] },
    { icon: <Award className="w-5 h-5 text-blue-500" />, text: tCeo.achievements[1] },
    { icon: <Users className="w-5 h-5 text-green-500" />, text: tCeo.achievements[2] },
    { icon: <Shield className="w-5 h-5 text-purple-500" />, text: tCeo.achievements[3] },
    { icon: <Eye className="w-5 h-5 text-indigo-500" />, text: tCeo.achievements[4] }
  ];

  const floatingIcons = [
    { icon: <Trophy className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-400" />, position: 'top-2 right-4 lg:top-4 lg:right-8', delay: 'delay-1000' },
    { icon: <Handshake className="w-4 h-4 lg:w-6 lg:h-6 text-blue-400" />, position: 'top-6 left-2 lg:top-12 lg:left-4', delay: 'delay-1200' },
    { icon: <Brain className="w-4 h-4 lg:w-6 lg:h-6 text-purple-400" />, position: 'bottom-4 right-2 lg:bottom-8 lg:right-4', delay: 'delay-1400' },
    { icon: <Shield className="w-4 h-4 lg:w-6 lg:h-6 text-green-400" />, position: 'bottom-2 left-4 lg:bottom-4 lg:left-8', delay: 'delay-1600' }
  ];

  /* ------------------ RENDER ------------------ */
  return (
    <div
      ref={sectionRef}
      id="ceo"
      className="bg-gradient-to-br from-fuchsia-900 via-purple-800 to-pink-700 pt-8 lg:pt-16 pb-8 lg:pb-12 px-4 lg:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* ---------- Left Column (Photo + Badge + Floating Icons) ---------- */}
            <div className="relative p-6 lg:p-12 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
              <div className="relative">
                {/* Glowing Badge */}
                <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-bold shadow-lg animate-pulse">
                    {tCeo.badge}
                  </div>
                </div>

                {/* Meet Mr. Your Name Image Container (replace inner div with <img src="..." alt="Owner" />) */}
                <div
                  className={`relative w-48 h-48 lg:w-64 lg:h-64 transition-all duration-1000 ${
                    isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center">
                       <div className="w-36 h-36 lg:w-48 lg:h-48 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full overflow-hidden">
                         <img src={ceoImage} alt="CEO" className="w-full h-full object-cover" />
                       </div>
                     </div>
                  </div>
                </div>

                {/* Floating Icons */}
                {floatingIcons.map((item, index) => (
                  <div
                    key={index}
                    className={`absolute ${item.position} animate-bounce ${item.delay} ${
                      isVisible ? 'opacity-100' : 'opacity-0'
                    } transition-opacity duration-1000 block`}
                  >
                    <div className="bg-white p-3 rounded-full shadow-lg">{item.icon}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- Right Column (Content) ---------- */}
            <div className="p-6 lg:p-12 flex flex-col justify-center">
              <div
                className={`transition-all duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                {/* Heading */}
                <div className="mb-6 lg:mb-8">
                  <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-2">{tCeo.header}</h2>
                  <div className="relative">
                    <p className="text-base lg:text-lg text-slate-600 italic">{tCeo.quote}</p>
                    <div
                      className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ${
                        isVisible ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      style={{
                        animation: isVisible ? `slide-right-to-center 0.8s ease-out forwards` : 'none',
                        animationDelay: isVisible ? `${index * 0.3}s` : '0s',
                        animationFillMode: 'forwards',
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateX(0)' : 'translateX(100vw)'
                      }}
                      className="flex items-center space-x-3 lg:space-x-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100"
                    >
                      <div className="flex-shrink-0">{achievement.icon}</div>
                      <p className="text-sm lg:text-base text-slate-700 font-medium">{achievement.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline keyframes compatible with Vite */}
      <style>{`
        @keyframes slide-right-to-center {
          0% { opacity: 0; transform: translateX(100vw); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default CEO;
