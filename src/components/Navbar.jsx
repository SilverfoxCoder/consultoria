import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import ServicesDropdown from './ServicesDropdown';
import NotificationBadge from './common/NotificationBadge';

const Navbar = ({ onNavClick, currentPage, onShowLogin, onShowRegister, onShowDashboard }) => {
  const { t } = useTranslations();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page) => {
    console.log('handleNavClick called with page:', page, 'currentPage:', currentPage);
    onNavClick(page);
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20'
      : 'bg-white/20 backdrop-blur-sm'
      }`}>
      <div className="container-max">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2"
            >
              <span className={`text-xl font-bold transition-colors duration-200 ${isScrolled ? 'text-gray-800' : 'text-white'
                }`}>XperiecIA Consulting</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`font-medium transition-colors duration-200 ${currentPage === 'home'
                ? 'text-primary-600'
                : isScrolled
                  ? 'text-gray-700 hover:text-primary-600'
                  : 'text-white hover:text-primary-400'
                }`}
            >
              {t('nav.home')}
            </button>

            {/* Services Dropdown */}
            <div className="relative">
              <ServicesDropdown
                isOpen={isServicesDropdownOpen}
                onToggle={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                onClose={() => setIsServicesDropdownOpen(false)}
                onServiceClick={handleNavClick}
                currentPage={currentPage}
                isScrolled={isScrolled}
              />
            </div>



            {/* Contact */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`font-medium transition-colors duration-200 ${currentPage === 'contact'
                ? 'text-primary-600'
                : isScrolled
                  ? 'text-gray-700 hover:text-primary-600'
                  : 'text-white hover:text-primary-400'
                }`}
            >
              {t('nav.contact')}
            </button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Login/User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <NotificationBadge />
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center space-x-2 transition-colors duration-200 ${isScrolled
                      ? 'text-gray-800 hover:text-primary-600'
                      : 'text-white hover:text-primary-400'
                      }`}
                  >
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-medium">{user?.name}</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 z-50">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onShowDashboard();
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                        >
                          {t('dashboard.title')}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        >
                          {t('dashboard.logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onShowRegister}
                  className="bg-primary-100 hover:bg-primary-200 text-primary-700 hover:text-primary-800 px-4 py-2 rounded-lg font-medium transition-colors duration-200 border border-primary-300 hover:border-primary-400"
                >
                  Registrarse
                </button>
                <button
                  onClick={onShowLogin}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  {t('login.signIn')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button and language selector */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation (expanded) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/20">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${currentPage === 'home'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
              >
                {t('nav.home')}
              </button>

              <button
                onClick={() => handleNavClick('desarrollo-web')}
                className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${currentPage === 'desarrollo-web'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
              >
                {t('services.webDevelopment.title')}
              </button>

              <button
                onClick={() => handleNavClick('aplicaciones-moviles')}
                className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${currentPage === 'aplicaciones-moviles'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
              >
                {t('services.mobileApps.title')}
              </button>

              <button
                onClick={() => handleNavClick('cloud-devops')}
                className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${currentPage === 'cloud-devops'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
              >
                {t('services.cloudDevOps.title')}
              </button>

              <button
                onClick={() => handleNavClick('consultoria-it')}
                className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${currentPage === 'consultoria-it'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
              >
                {t('services.itConsulting.title')}
              </button>

              <button
                onClick={() => handleNavClick('inteligencia-artificial')}
                className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${currentPage === 'inteligencia-artificial'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
              >
                {t('services.artificialIntelligence.title')}
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${currentPage === 'contact'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
              >
                {t('nav.contact')}
              </button>

              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onShowRegister();
                    }}
                    className="block w-full bg-primary-100 hover:bg-primary-200 text-primary-700 hover:text-primary-800 px-4 py-2 rounded-lg font-medium transition-colors duration-200 border border-primary-300 hover:border-primary-400"
                  >
                    Registrarse
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onShowLogin();
                    }}
                    className="block w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {t('login.signIn')}
                  </button>
                </div>
              )}

              {/* Mobile User Menu */}
              {isAuthenticated && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center px-3 py-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-medium text-gray-700">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onShowDashboard();
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
                  >
                    {t('dashboard.title')}
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    {t('dashboard.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;