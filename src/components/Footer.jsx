import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const Footer = () => {
  const { t } = useTranslations();
  
  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm text-white border-t border-gray-800">
      <div className="container-max py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo and Copyright */}
          <div className="flex items-center mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-primary-400 mr-4">
              Codethics
            </h3>
            <span className="text-gray-400">
              {t('footer.copyright')}
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex space-x-6">
            <button
              onClick={() => {
                const element = document.getElementById('inicio');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('servicios');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {t('nav.services')}
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('casos-exito');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {t('nav.successCases')}
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('contacto');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {t('nav.contact')}
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
  );
};

export default Footer; 