import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useSection } from '../context/SectionContext.jsx';

export default function MapSection() {
  const { setCurrentSection } = useSection();
  const { lang, translations } = useLanguage();
  const tSec = translations[lang]?.sections || translations.en.sections;
  const sectionRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentSection(tSec.contact);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [setCurrentSection, lang]);

  return (
    <section ref={sectionRef} id="contact" className="min-h-screen flex flex-col justify-center bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Map iframe */}
          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg mb-6">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343005!2d-74.0042587247878!3d40.74077021938814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c8a5789%3A0xc0e856f2daf0ba93!2s123%20Business%20Ave%2C%20New%20York%2C%20NY%2010001%2C%20USA!5e0!3m2!1sen!2sus!4v1690830000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          
          {/* Address */}
          <div className="flex items-center justify-center">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <p className="text-lg">123 Business Avenue, City, Country</p>
          </div>
        </div>
      </div>
    </section>
  );
}
