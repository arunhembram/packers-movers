import React from 'react';
import { SectionProvider } from './context/SectionContext.jsx';
import Header from './components/Header';
import FrownToSmile from './components/FrownToSmile';
import Services from './components/Services';
import SuperFastDelivery from './components/SuperFastDelivery';
import ItemsDamaged from './components/ItemsDamaged';
import CEO from './components/CEO';
import Testimonials from './components/Testimonials';
import SocialMediaSlider from './components/SocialMediaSlider';
import MapSection from './components/MapSection';
import LanguageGate from './components/LanguageGate';

// Import translations
import translations from './i18n/translations';

function App() {
  return (
    <LanguageGate translations={translations}>
      <SectionProvider>
        <div className="min-h-screen bg-gray-50">
          <Header className="min-h-screen" />
          <FrownToSmile id="hero" className="min-h-screen" />
          <Services id="services" className="min-h-screen" />
          <SuperFastDelivery id="speed" />
          <ItemsDamaged id="damage" />
          <CEO id="ceo" className="min-h-screen" />
          <Testimonials id="testimonials" />
          <SocialMediaSlider id="social" className="min-h-screen" />
          <MapSection id="contact" className="min-h-screen" />
        </div>
      </SectionProvider>
    </LanguageGate>
  );
}

export default App;
