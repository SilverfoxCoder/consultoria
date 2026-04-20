import { useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';

export const useTranslations = () => {
  const { currentLanguage } = useLanguage();
  
  const t = useCallback((key, fallback) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for language: ${currentLanguage}`);
        return fallback || key; // Return the fallback or key if translation not found
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