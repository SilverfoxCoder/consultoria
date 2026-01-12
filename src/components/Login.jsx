import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from './auth/GoogleLoginButton';
import RegisterModal from './auth/RegisterModal';

const Login = ({ onLogin, onBack }) => {
  const { t } = useTranslations();
  const { loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Usar el servicio de autenticación
      const authData = await userService.authenticate(formData.email, formData.password);
      onLogin(authData);
    } catch (err) {
      setError(t('login.credentialsError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleUserData) => {
    setIsGoogleLoading(true);
    setError('');

    try {
      const result = await loginWithGoogle(googleUserData);

      if (result.success) {
        console.log('🎉 Login: Google OAuth exitoso');
        // No necesitamos llamar onLogin() aquí porque loginWithGoogle ya maneja el login
        // El AuthContext se encargará de actualizar el estado de autenticación
        if (window.showToast) {
          window.showToast({
            message: result.isNewUser ?
              t('login.accountCreatedSuccess') :
              t('login.signInSuccess'),
            type: 'success'
          });
        }
      } else {
        setError(result.error || t('login.googleError'));
      }
    } catch (error) {
      console.error('❌ Login: Error en Google OAuth:', error);
      setError(t('login.googleError'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('❌ Login: Error de Google OAuth:', error);
    setError(t('login.googleError'));
    setIsGoogleLoading(false);
  };

  const handleRegisterSuccess = (registerData) => {
    console.log('✅ Login: Registro exitoso, redirigiendo al login');
    setShowRegisterModal(false);

    // Mostrar mensaje de éxito
    if (window.showToast) {
      window.showToast({
        message: '¡Registro exitoso! Ya puedes iniciar sesión.',
        type: 'success'
      });
    }
  };

  const handleShowRegister = () => {
    setShowRegisterModal(true);
  };

  const handleCloseRegister = () => {
    setShowRegisterModal(false);
  };

  return (
    <div className="min-h-screen relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2">
              {t('login.title')}
            </h2>
            <p className="text-gray-300">
              {t('login.subtitle')}
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                {t('login.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder={t('login.emailPlaceholder')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                {t('login.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder={t('login.passwordPlaceholder')}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('login.signingIn')}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                    </svg>
                    {t('login.signIn')}
                  </div>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-300">{t('login.continueWith')}</span>
              </div>
            </div>

            {/* Google Login Button */}
            <div>
              <GoogleLoginButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                buttonText={isGoogleLoading ? t('login.connectWithGoogle') : t('login.signInWithGoogle')}
                className={`${isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
          </form>

          {/* Back to Home Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center justify-center w-full"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('login.backToHome')}
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-300 text-sm">
              {t('login.noAccount')}{' '}
              <button
                onClick={handleShowRegister}
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors underline"
              >
                {t('login.createAccount')}
              </button>
            </p>
          </div>
        </div>


      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterModal
          onClose={handleCloseRegister}
          onLoginClick={handleCloseRegister}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
};

export default Login; 