import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useSection } from '../context/SectionContext.jsx';

export default function SocialMedia() {
  const { setCurrentSection } = useSection();
  const { lang, translations } = useLanguage();
  const tSec = translations[lang]?.sections || translations.en.sections;
  const tSocial = translations[lang]?.socialMedia || translations.en.socialMedia;
  const sectionRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentSection(tSec.social);
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

  const socialMedia = [
    { name: "Facebook", icon: <FaFacebook />, color: "bg-blue-600" },
    { name: "Instagram", icon: <FaInstagram />, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { name: "YouTube", icon: <FaYoutube />, color: "bg-red-600" },
    { name: "Twitter", icon: <FaTwitter />, color: "bg-blue-400" },
    { name: "LinkedIn", icon: <FaLinkedin />, color: "bg-blue-700" },
  ];

  return (
    <section ref={sectionRef} id="social" className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{tSocial.header}</h2>
        
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            640: {
              slidesPerView: 5,
            },
          }}
          className="max-w-4xl mx-auto"
        >
          {socialMedia.map((social, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <div className={`${social.color} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl`}>
                {social.icon}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
