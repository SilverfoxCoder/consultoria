import React, { useState, useEffect } from 'react';
// Calendly Integration v1.1
import { useTranslations } from '../hooks/useTranslations';
import { PopupModal } from 'react-calendly';
import { settingsService } from '../services/settingsService';

const Contact = () => {
  const { t } = useTranslations();
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState('');

  useEffect(() => {
    // Cargar URL de Calendly de la configuración
    const integrations = settingsService.getSection('integrations');
    if (integrations.calendly) {
      setCalendlyUrl(integrations.calendly);
    }
  }, []);

  const handleCalendlyClick = () => {
    if (calendlyUrl) {
      setIsCalendlyOpen(true);
    } else {
      alert('La integración con Calendly no está configurada. Por favor contacta al administrador.');
      // Fallback opcional: window.open('https://calendly.com/', '_blank');
    }
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:contacto@XperiencIA.com';
  };

  return (
    <section id="contacto" className="section-padding relative">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-500 mb-4 drop-shadow-sm">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-sm">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-primary-500 mb-6">
                {t('contact.project.title')}
              </h3>
              <p className="text-white mb-8 leading-relaxed">
                {t('contact.project.description')}
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-500 mb-2">{t('contact.methods.meeting.title')}</h4>
                  <p className="text-white mb-3">
                    {t('contact.methods.meeting.description')}
                  </p>
                  <button
                    onClick={handleCalendlyClick}
                    className="btn-primary"
                  >
                    {t('contact.methods.meeting.button')}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-500 mb-2">{t('contact.methods.email.title')}</h4>
                  <p className="text-white mb-3">
                    {t('contact.methods.email.description')}
                  </p>
                  <button
                    onClick={handleEmailClick}
                    className="btn-secondary"
                  >
                    contacto@XperiencIA.com
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-semibold text-primary-500 mb-3">{t('contact.consultation.title')}</h4>
              <ul className="space-y-2 text-white">
                {t('contact.consultation.items').map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form Placeholder */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t('contact.ready.title')}
              </h3>
              <p className="text-primary-100 mb-8">
                {t('contact.ready.description')}
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleCalendlyClick}
                  className="w-full bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  {t('contact.ready.scheduleButton')}
                </button>
                <button
                  onClick={handleEmailClick}
                  className="w-full bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  {t('contact.ready.emailButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendly Widget */}
      <PopupModal
        url={calendlyUrl}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById('root')}
      />
    </section>
  );
};

export default Contact;