import { useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';

export const useTranslations = () => {
  const { currentLanguage } = useLanguage();
  
  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for language: ${currentLanguage}`);
        return key; // Return the key if translation not found
      }
    }
    
    return value;
  }, [currentLanguage]);

  return {
    t,
    currentLanguage,
    translations: translations[currentLanguage]
  };
}; 