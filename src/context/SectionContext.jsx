import { createContext, useContext, useState } from 'react';

const SectionContext = createContext();

export function SectionProvider({ children }) {
  const [currentSection, setCurrentSection] = useState('');
  const [animationsTriggered, setAnimationsTriggered] = useState({});

  const triggerAnimation = (sectionId) => {
    setAnimationsTriggered(prev => ({
      ...prev,
      [sectionId]: true
    }));
  };

  return (
    <SectionContext.Provider value={{ 
      currentSection, 
      setCurrentSection,
      animationsTriggered,
      triggerAnimation
    }}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSection() {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error('useSection must be used within a SectionProvider');
  }
  return context;
}
