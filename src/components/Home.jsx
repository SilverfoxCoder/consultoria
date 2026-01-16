import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../contexts/AuthContext';

const Home = ({ onShowRegister, onShowDashboard, onShowServices }) => {
  const { t } = useTranslations();
  const { isAuthenticated } = useAuth();

  const handleStartProject = () => {
    if (isAuthenticated) {
      // Si el usuario está logueado, ir al dashboard
      onShowDashboard();
    } else {
      // Si no está logueado, ir al registro
      onShowRegister();
    }
  };

  const handleViewServices = () => {
    if (isAuthenticated) {
      // Si el usuario está logueado, ir a servicios
      onShowServices();
    } else {
      // Si no está logueado, ir al registro
      onShowRegister();
    }
  };

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center relative">
      <div className="container-max section-padding">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Content */}
          <div className="mb-8">
            <img
              src="/logo-xperiecia.png"
              alt="Xperiecia Consulting"
              className="mx-auto h-48 md:h-64 w-auto mb-8 animate-fade-in drop-shadow-2xl"
            />
            <h1 className="text-4xl md:text-6xl font-bold text-primary-500 mb-6 leading-tight drop-shadow-sm">
              {t('home.hero.title')}
              <span className="text-primary-400 block drop-shadow-sm">{t('home.hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed drop-shadow-sm">
              {t('home.hero.subtitle')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">+150</div>
              <div className="text-primary-500 font-medium">{t('home.stats.projects')}</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">+50</div>
              <div className="text-primary-500 font-medium">{t('home.stats.clients')}</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">+15</div>
              <div className="text-primary-500 font-medium">{t('home.stats.experience')}</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartProject}
              className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isAuthenticated ? t('home.cta.startProject') : t('home.cta.registerNow')}
            </button>
            <button
              onClick={handleViewServices}
              className="btn-secondary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isAuthenticated ? t('home.cta.viewServices') : t('home.cta.learnMore')}
            </button>
          </div>

          {/* Branding Banner */}
          <div className="mt-16 pt-8 border-t border-gray-200/50">
            <div className="flex justify-center items-center">
              <img
                src="/assets/images/branding/home-banner.jpg"
                alt="Automatización Inteligente"
                className="max-w-full h-auto rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home; 