import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

const MarketingCorporativo = () => {
  const { t } = useTranslations();

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                {t('services.corporateMarketing.title')}
              </h1>
              <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
                {t('services.corporateMarketing.subtitle')}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-primary-500 mb-4">
                  {t('services.corporateMarketing.services.title')}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-primary-500 font-medium">{t('services.corporateMarketing.services.branding')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-primary-500 font-medium">{t('services.corporateMarketing.services.strategy')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-primary-500 font-medium">{t('services.corporateMarketing.services.content')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-primary-500 font-medium">{t('services.corporateMarketing.services.digital')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-primary-500 font-medium">{t('services.corporateMarketing.services.analytics')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-primary-500 mb-4">
                  {t('services.corporateMarketing.channels.title')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-500/30 rounded-lg p-3 text-center border border-blue-400/30">
                    <span className="text-blue-100 font-semibold drop-shadow-sm">LinkedIn</span>
                  </div>
                  <div className="bg-purple-500/30 rounded-lg p-3 text-center border border-purple-400/30">
                    <span className="text-purple-100 font-semibold drop-shadow-sm">Email Marketing</span>
                  </div>
                  <div className="bg-cyan-500/30 rounded-lg p-3 text-center border border-cyan-400/30">
                    <span className="text-cyan-100 font-semibold drop-shadow-sm">Content Marketing</span>
                  </div>
                  <div className="bg-red-500/30 rounded-lg p-3 text-center border border-red-400/30">
                    <span className="text-red-100 font-semibold drop-shadow-sm">SEO</span>
                  </div>
                  <div className="bg-blue-600/30 rounded-lg p-3 text-center border border-blue-500/30">
                    <span className="text-blue-100 font-semibold drop-shadow-sm">PPC</span>
                  </div>
                  <div className="bg-pink-500/30 rounded-lg p-3 text-center border border-pink-400/30">
                    <span className="text-pink-100 font-semibold drop-shadow-sm">Eventos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-primary-500 mb-6">
                  {t('services.corporateMarketing.process.title')}
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.corporateMarketing.process.audit')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.corporateMarketing.process.auditDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.corporateMarketing.process.strategy')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.corporateMarketing.process.strategyDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.corporateMarketing.process.implementation')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.corporateMarketing.process.implementationDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.corporateMarketing.process.optimization')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.corporateMarketing.process.optimizationDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-primary-500 mb-4">
                  {t('services.corporateMarketing.pricing.title')}
                </h3>
                <div className="text-center">
                  <p className="text-white mb-4">{t('services.corporateMarketing.pricing.description')}</p>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6">
                    <p className="text-white font-bold text-2xl mb-2">{t('services.corporateMarketing.pricing.startingFrom')}</p>
                    <p className="text-white text-xl font-semibold">2.500 €/mes</p>
                  </div>
                  <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
                    {t('services.corporateMarketing.pricing.consult')}
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

export default MarketingCorporativo; 