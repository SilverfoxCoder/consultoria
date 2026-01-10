import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import LegalNotice from './LegalNotice';

const Footer = ({ onNavClick }) => {
  const { t } = useTranslations();
  const [showLegalNotice, setShowLegalNotice] = useState(false);

  const handleNavLink = (section) => {
    // Si estamos en una página diferente a home, navegar primero a home
    if (onNavClick) {
      onNavClick('home');

      // Hacer scroll a la sección después de que se renderice la página home
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Si no hay onNavClick (estamos en home), solo hacer scroll
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <footer className="bg-gray-900/95 backdrop-blur-sm text-white border-t border-gray-800">
        <div className="container-max py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Logo and Copyright */}
            <div className="flex items-center mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-primary-400 mr-4">
                XperiencIA Consulting
              </h3>
              <span className="text-gray-400">
                {t('footer.copyright')}
              </span>
            </div>

            {/* Quick Links */}
            <div className="flex space-x-6">
              <button
                onClick={() => handleNavLink('inicio')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => handleNavLink('servicios')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {t('nav.services')}
              </button>
              <button
                onClick={() => handleNavLink('contacto')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {t('nav.contact')}
              </button>
              <button
                onClick={() => setShowLegalNotice(true)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Aviso Legal
              </button>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              {t('footer.tagline')}
            </p>
          </div>
        </div>
      </footer>

      {/* Legal Notice Modal */}
      {showLegalNotice && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="relative inline-block w-full max-w-6xl">
              <div className="relative bg-white rounded-lg shadow-xl">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setShowLegalNotice(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <LegalNotice />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer; 