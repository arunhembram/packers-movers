import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSection } from '../context/SectionContext.jsx';
import './ContactSection.css';

export default function ContactSection() {
  const { setCurrentSection } = useSection();
  const { lang, translations } = useLanguage();
  const tSec = translations[lang]?.sections || translations.en.sections;
  const tContact = translations[lang]?.contactSection || translations.en.contactSection;
  const sectionRef = useRef(null);

  /* ------------------ Intersection ------------------ */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentSection(tSec.contact);
        }
      },
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setCurrentSection, lang, tSec.contact]);

  /* ------------------ Animations & JS ------------------ */
  useEffect(() => {

    const truck = document.getElementById('movingTruck');
    const boxContainer = document.getElementById('packagingBoxes');
    const googleMap = document.getElementById('googleMap');

    // Map error fallback
    if (googleMap) {
      googleMap.addEventListener('error', () => {
        const mapFrame = document.querySelector('.map-frame');
        if (!mapFrame) return;
        mapFrame.innerHTML = `\n          <div class="map-fallback">\n            <i class="fas fa-map-marker-alt" style="font-size:48px; color:var(--primary-color); margin-bottom:16px;"></i>\n            <p>Map not available</p>\n            <a href="https://maps.app.goo.gl/e5KUc2hsG9Ku7k1j8" target="_blank" rel="noopener noreferrer">View on Google Maps</a>\n          </div>`;
      });
    }

    let animationFrame = null;
    /** Box position cache */
    let boxData = [];

    function calculateBoxPositions() {
      if (!boxContainer) return;
      const boxes = boxContainer.querySelectorAll('.box');
      boxData = [];
      boxes.forEach((box, index) => {
        const rect = box.getBoundingClientRect();
        boxData.push({
          element: box,
          domIndex: index,
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          eaten: false,
        });
      });
      // right-to-left order
      boxData.sort((a, b) => b.centerX - a.centerX);
    }

    function adjustForMobile() {
      if (!boxContainer) return;
      const w = window.innerWidth;
      const set = (prop, val) => boxContainer.style.setProperty(prop, val);
      if (w <= 480) {
        set('--box-1-pos', '15%');
        set('--box-2-pos', '35%');
        set('--box-3-pos', '55%');
        set('--box-4-pos', '75%');
      } else if (w <= 768) {
        set('--box-1-pos', '18%');
        set('--box-2-pos', '38%');
        set('--box-3-pos', '58%');
        set('--box-4-pos', '78%');
      } else {
        set('--box-1-pos', '20%');
        set('--box-2-pos', '40%');
        set('--box-3-pos', '60%');
        set('--box-4-pos', '80%');
      }
    }

    function resetBoxes() {
      if (!boxContainer) return;
      adjustForMobile();
      boxContainer.innerHTML = `\n        <div class="box">📦</div>\n        <div class="box">📦</div>\n        <div class="box">📦</div>\n        <div class="box">📦</div>`;
      // wait for DOM paint
      setTimeout(calculateBoxPositions, 100);
    }

    function checkCollision() {
      if (!truck) return;
      const truckRect = truck.getBoundingClientRect();
      const truckCenterX = truckRect.left + truckRect.width / 2;
      const truckCenterY = truckRect.top + truckRect.height / 2;
      const threshold = 45;
      const available = boxData.filter((b) => !b.eaten && b.element.parentNode);
      if (!available.length) return;
      const inRange = available.filter((b) => {
        const dist = Math.hypot(truckCenterX - b.centerX, truckCenterY - b.centerY);
        return dist < threshold;
      });
      if (!inRange.length) return;
      const target = inRange.reduce((rightmost, cur) => (cur.centerX > rightmost.centerX ? cur : rightmost));
      if (target) {
        target.eaten = true;
        const el = target.element;
        el.style.transition = 'all 0.3s ease-out';
        el.style.transform = 'scale(0) rotate(360deg)';
        el.style.opacity = '0';
        setTimeout(() => {
          if (el && el.parentNode) el.remove();
        }, 300);
      }
    }

    function animateEating() {
      if (!truck || !truck.classList.contains('visible')) return;
      checkCollision();
      animationFrame = requestAnimationFrame(animateEating);
    }

    function startRun() {
      resetBoxes();
      setTimeout(() => {
        boxContainer.classList.add('visible');
        truck.classList.add('visible', 'moving-left');
        setTimeout(() => animateEating(), 200);
      }, 200);
    }

    function resizeHandler() {
      adjustForMobile();
      setTimeout(calculateBoxPositions, 100);
    }

    window.addEventListener('resize', resizeHandler);

    // handle end of truck animation
    if (truck) {
      truck.addEventListener('animationend', (e) => {
        if (e.animationName === 'moveRightToLeft') {
          truck.classList.remove('visible', 'moving-left');
          boxContainer.classList.remove('visible');
          if (animationFrame) cancelAnimationFrame(animationFrame);
          setTimeout(startRun, 2000);
        }
      });
    }

    // initial
    startRun();

    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  /* ------------------ JSX ------------------ */
  return (
    <section ref={sectionRef} id="contact" className="contact-bg flex justify-center py-12">
      <main className="contact-container" role="main">
        <header className="section-title">
          <i className="fas fa-map-marker-alt" aria-hidden="true" />
          {tContact.header}
        </header>

        {/* Left – Map */}
        <section className="left-column" aria-labelledby="map-section">
          <div className="map-container">
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.7845392789!2d88.3265!3d22.6456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89c6b8c91e4a7%3A0x7c9f4a3b5a1e2c3d!2s20%2FW%2C%20Nandan%20Kanan%20Durga%20Mandir%2C%20Hindmotor%2C%20Hooghly%20712233%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Indian Packers & Movers Location Map"
                id="googleMap"
              />
            </div>
          </div>
          <a
            href="https://maps.app.goo.gl/e5KUc2hsG9Ku7k1j8"
            target="_blank"
            rel="noopener noreferrer"
            className="map-link-button"
          >
            <i className="fas fa-location-arrow" aria-hidden="true"></i>
            {tContact.viewMap}
          </a>
        </section>

        {/* Right – Details */}
        <section className="right-column" aria-labelledby="contact-details">
          <div className="contact-details" role="list">
            <div className="contact-item" role="listitem">
              <i className="fas fa-home contact-icon" aria-hidden="true"></i>
              <div className="contact-text">
                <div className="contact-label">{tContact.addressLabel}</div>
                <address className="contact-value">
                  20/W, Nandan Kanan Durga Mandir<br />
                  Hindmotor, Hooghly 712233<br />
                  West Bengal
                </address>
              </div>
            </div>
            <div className="contact-item" role="listitem">
              <i className="fas fa-envelope contact-icon" aria-hidden="true"></i>
              <div className="contact-text">
                <div className="contact-label">{tContact.emailLabel}</div>
                <div className="contact-value">
                  <a
                    href="mailto:support@yourcompanyname.in"
                    className="email-link"
                    aria-label="Send email to support@yourcompanyname.in"
                  >
                    support@yourcompanyname.in
                  </a>
                </div>
              </div>
            </div>
            <div className="contact-item" role="listitem">
              <i className="fas fa-clock contact-icon" aria-hidden="true"></i>
              <div className="contact-text">
                <div className="contact-label">{tContact.openingHoursLabel}</div>
                <div className="hours-grid">
                  <span className="hours-days">{tContact.monSat}</span>
                  <span className="hours-time">9:00 AM–7:00 PM</span>
                  <span className="hours-days">{tContact.sunday}</span>
                  <span className="hours-time closed">{tContact.closed}</span>
                </div>
              </div>
            </div>
          </div>
          <a
            href="tel:+916291270166"
            className="call-button"
            aria-label="Call Indian Packers & Movers at +91 6291270166"
          >
            <i className="fas fa-phone" aria-hidden="true"></i>
            <span>{tContact.callNow}</span>
          </a>
        </section>

        {/* Truck & Boxes Animation */}
        <div className="truck-animation" aria-hidden="true">
          <div className="packaging-boxes" id="packagingBoxes">
            <div className="box">📦</div>
            <div className="box">📦</div>
            <div className="box">📦</div>
            <div className="box">📦</div>
          </div>
          <div className="truck" id="movingTruck" role="img" aria-label="Moving truck eating packages">
            🚛
          </div>
        </div>
      </main>
    </section>
  );
}
