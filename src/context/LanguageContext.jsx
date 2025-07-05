import React, { createContext, useContext } from 'react';

export const LanguageContext = createContext({ lang: 'en', translations: {} });

export function LanguageProvider({ children, lang, translations }) {
    return (
    <LanguageContext.Provider value={{ lang, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
