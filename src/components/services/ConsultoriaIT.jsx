import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

const ConsultoriaIT = () => {
  const { t } = useTranslations();

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
              {t('services.itConsulting.title')}
            </h1>
              <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
                {t('services.itConsulting.subtitle')}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-primary-500 mb-4">
                  {t('services.itConsulting.services.title')}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-white font-medium">{t('services.itConsulting.services.strategy')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-white font-medium">{t('services.itConsulting.services.optimization')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-white font-medium">{t('services.itConsulting.services.architecture')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-white font-medium">{t('services.itConsulting.services.security')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-white font-medium">{t('services.itConsulting.services.transformation')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-primary-500 mb-4">
                  {t('services.itConsulting.technologies.title')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-500/30 rounded-lg p-3 text-center border border-blue-400/30">
                    <span className="text-blue-100 font-semibold drop-shadow-sm">Cloud</span>
                  </div>
                  <div className="bg-green-500/30 rounded-lg p-3 text-center border border-green-400/30">
                    <span className="text-green-100 font-semibold drop-shadow-sm">DevOps</span>
                  </div>
                  <div className="bg-yellow-500/30 rounded-lg p-3 text-center border border-yellow-400/30">
                    <span className="text-yellow-100 font-semibold drop-shadow-sm">Security</span>
                  </div>
                  <div className="bg-red-500/30 rounded-lg p-3 text-center border border-red-400/30">
                    <span className="text-red-100 font-semibold drop-shadow-sm">Data</span>
                  </div>
                  <div className="bg-indigo-500/30 rounded-lg p-3 text-center border border-indigo-400/30">
                    <span className="text-indigo-100 font-semibold drop-shadow-sm">AI/ML</span>
                  </div>
                  <div className="bg-pink-500/30 rounded-lg p-3 text-center border border-pink-400/30">
                    <span className="text-pink-100 font-semibold drop-shadow-sm">Legacy</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-primary-500 mb-6">
                  {t('services.itConsulting.methodology.title')}
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.itConsulting.methodology.assessment')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.itConsulting.methodology.assessmentDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.itConsulting.methodology.planning')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.itConsulting.methodology.planningDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.itConsulting.methodology.implementation')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.itConsulting.methodology.implementationDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.itConsulting.methodology.monitoring')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.itConsulting.methodology.monitoringDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.itConsulting.methodology.optimization')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.itConsulting.methodology.optimizationDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-xl">
                <h3 className="text-2xl font-bold text-primary-500 mb-4">
                  {t('services.itConsulting.pricing.title')}
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-500 mb-2">
                    {t('services.itConsulting.pricing.startingFrom')}
                  </div>
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
                    120 €/hora
                  </div>
                  <p className="text-white mb-6 font-medium">{t('services.itConsulting.pricing.description')}</p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                    {t('services.itConsulting.pricing.consult')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConsultoriaIT; 