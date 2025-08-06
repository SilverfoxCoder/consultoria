import React, { useState } from 'react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useTranslations } from '../../hooks/useTranslations';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import GoogleLoginButton from './GoogleLoginButton';

const RegisterModal = ({ onClose, onLoginClick, onRegisterSuccess }) => {
  const { t } = useTranslations();
  const { loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = t('register.name') + ' es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('register.name') + ' debe tener al menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t('register.email') + ' es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = t('register.password') + ' es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = t('register.password') + ' debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar teléfono (opcional pero si se proporciona, debe ser válido)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Ingresa un número de teléfono válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo que se está editando
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔄 RegisterModal: Iniciando registro de cliente');
      console.log('Datos del formulario:', {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone
      });

      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        company: formData.company.trim() || null,
        phone: formData.phone.trim() || null,
        role: 'client' // Siempre será cliente en este registro
      };

      const response = await authService.register(registerData);
      
      console.log('✅ RegisterModal: Registro exitoso:', response);

      // Mostrar mensaje de éxito
      if (window.showToast) {
        window.showToast({
          message: t('register.successMessage'),
          type: 'success'
        });
      }

      // Opcional: Auto-login después del registro exitoso
      if (onRegisterSuccess) {
        onRegisterSuccess(response);
      } else {
        // Si no hay callback, cerrar modal y mostrar login
        onClose();
        if (onLoginClick) {
          onLoginClick();
        }
      }

    } catch (error) {
      console.error('❌ RegisterModal: Error en el registro:', error);
      
      let errorMessage = t('register.errorMessage');
      
      if (error.message.includes('409')) {
        errorMessage = t('register.emailExistsError');
        setErrors({ email: t('register.emailExistsError') });
      } else if (error.message.includes('400')) {
        errorMessage = t('register.invalidDataError');
      } else if (error.message.includes('500')) {
        errorMessage = t('register.serverError');
      } else {
        errorMessage = error.message || t('register.errorMessage');
      }

      if (window.showToast) {
        window.showToast({
          message: errorMessage,
          type: 'error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleUserData) => {
    setIsGoogleLoading(true);
    setErrors({});

    try {
      const result = await loginWithGoogle(googleUserData);
      
      if (result.success) {
        console.log('🎉 RegisterModal: Google OAuth exitoso');
        
        if (window.showToast) {
          window.showToast({
            message: result.isNewUser ? 
              t('register.accountCreatedSuccess') : 
              t('register.signInSuccess'),
            type: 'success'
          });
        }

        // Opcional: ejecutar callback de éxito si existe
        if (onRegisterSuccess) {
          onRegisterSuccess({ isGoogleAuth: true, isNewUser: result.isNewUser });
        } else {
          // Cerrar modal automáticamente
          onClose();
        }
      } else {
        console.error('❌ RegisterModal: Error en Google OAuth:', result.error);
        
        if (window.showToast) {
          window.showToast({
            message: result.error || t('register.googleError'),
            type: 'error'
          });
        }
      }
    } catch (error) {
      console.error('❌ RegisterModal: Error en Google OAuth:', error);
      
      if (window.showToast) {
        window.showToast({
          message: t('register.googleError'),
          type: 'error'
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('❌ RegisterModal: Error de Google OAuth:', error);
    setIsGoogleLoading(false);
    
    if (window.showToast) {
      window.showToast({
        message: t('register.googleConnectError'),
        type: 'error'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('register.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('register.name')} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('register.namePlaceholder')}
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('register.email')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('register.emailPlaceholder')}
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Empresa */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              {t('register.company')}
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              placeholder={t('register.companyPlaceholder')}
              disabled={isLoading}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              {t('register.phone')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('register.phonePlaceholder')}
              disabled={isLoading}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('register.password')} *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('register.passwordPlaceholder')}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t('register.confirmPassword')} *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('register.confirmPasswordPlaceholder')}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Términos y condiciones */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {t('register.termsText')}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('register.creatingAccount')}
              </>
            ) : (
                              t('register.createAccount')
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t('register.orRegisterWith')}</span>
            </div>
          </div>

          {/* Google Register Button */}
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            buttonText={isGoogleLoading ? t('register.connectingWithGoogle') : t('register.registerWithGoogle')}
            className={`${isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-600">
            {t('register.alreadyHaveAccount')}{' '}
            <button
              onClick={() => {
                onClose();
                onLoginClick();
              }}
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {t('register.signInHere')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;