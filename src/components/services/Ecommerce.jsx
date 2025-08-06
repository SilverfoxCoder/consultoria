import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

const Ecommerce = () => {
  const { t } = useTranslations();

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                {t('services.ecommerce.title')}
              </h1>
              <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
                {t('services.ecommerce.subtitle')}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-primary-500 mb-4">
                  {t('services.ecommerce.features.title')}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-primary-500 font-medium">{t('services.ecommerce.features.catalog')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-primary-500 font-medium">{t('services.ecommerce.features.payment')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-primary-500 font-medium">{t('services.ecommerce.features.inventory')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-primary-500 font-medium">{t('services.ecommerce.features.analytics')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <span className="text-primary-500 font-medium">{t('services.ecommerce.features.mobile')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-primary-500 mb-4">
                  {t('services.ecommerce.platforms.title')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-500/30 rounded-lg p-3 text-center border border-blue-400/30">
                    <span className="text-blue-100 font-semibold drop-shadow-sm">Shopify</span>
                  </div>
                  <div className="bg-purple-500/30 rounded-lg p-3 text-center border border-purple-400/30">
                    <span className="text-purple-100 font-semibold drop-shadow-sm">WooCommerce</span>
                  </div>
                  <div className="bg-indigo-500/30 rounded-lg p-3 text-center border border-indigo-400/30">
                    <span className="text-indigo-100 font-semibold drop-shadow-sm">Magento</span>
                  </div>
                  <div className="bg-cyan-500/30 rounded-lg p-3 text-center border border-cyan-400/30">
                    <span className="text-cyan-100 font-semibold drop-shadow-sm">PrestaShop</span>
                  </div>
                  <div className="bg-emerald-500/30 rounded-lg p-3 text-center border border-emerald-400/30">
                    <span className="text-emerald-100 font-semibold drop-shadow-sm">BigCommerce</span>
                  </div>
                  <div className="bg-rose-500/30 rounded-lg p-3 text-center border border-rose-400/30">
                    <span className="text-rose-100 font-semibold drop-shadow-sm">Custom</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-primary-500 mb-6">
                  {t('services.ecommerce.process.title')}
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.ecommerce.process.planning')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.ecommerce.process.planningDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.ecommerce.process.design')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.ecommerce.process.designDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.ecommerce.process.development')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.ecommerce.process.developmentDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.ecommerce.process.integration')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.ecommerce.process.integrationDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h4 className="text-primary-500 font-semibold mb-2">{t('services.ecommerce.process.launch')}</h4>
                      <p className="text-white text-sm leading-relaxed">{t('services.ecommerce.process.launchDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-xl">
                <h3 className="text-2xl font-bold text-primary-500 mb-4">
                  {t('services.ecommerce.pricing.title')}
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-500 mb-2">
                    {t('services.ecommerce.pricing.startingFrom')}
                  </div>
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
                    6.500 €
                  </div>
                  <p className="text-white mb-6 font-medium">{t('services.ecommerce.pricing.description')}</p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                    {t('services.ecommerce.pricing.consult')}
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

export default Ecommerce; 