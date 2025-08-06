import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../hooks/useTranslations';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslations();

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div className="flex items-center space-x-2">
        <GlobeAltIcon className="h-5 w-5 text-gray-400" />
        <select
          value={currentLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block px-3 py-2 cursor-pointer hover:bg-gray-700 transition-colors"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector; 