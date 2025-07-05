import { createContext, useState, useContext } from 'react';

const SectionContext = createContext();

export const SectionProvider = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('Home');
  return (
    <SectionContext.Provider value={{ currentSection, setCurrentSection }}>
      {children}
    </SectionContext.Provider>
  );
};

export const useSection = () => useContext(SectionContext);
