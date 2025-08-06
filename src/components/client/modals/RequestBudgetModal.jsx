import React, { useState } from 'react';
import { useTranslations } from '../../../hooks/useTranslations';
import { DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';
import budgetService from '../../../services/budgetService';
import { useAuth } from '../../../contexts/AuthContext';

const RequestBudgetModal = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslations();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceType: '',
    budget: '',
    timeline: '',
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    'Desarrollo Web',
    'Desarrollo Móvil',
    'Consultoría IT',
    'Servicios Cloud',
    'Inteligencia Artificial',
    'Ciberseguridad',
    'Otro'
  ];

  const timelineOptions = [
    '1-2 semanas',
    '1 mes',
    '2-3 meses',
    '3-6 meses',
    '6+ meses',
    'Por definir'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Enviando solicitud de presupuesto:', formData);
      
      // Usar el ID del usuario autenticado
      const clientId = user?.id || 5; // Fallback al cliente de prueba si no hay usuario
      
      // Preparar datos para el backend
      const budgetData = {
        title: formData.title,
        description: formData.description,
        serviceType: formData.serviceType,
        budget: formData.budget ? parseFloat(formData.budget.replace(/[^\d]/g, '')) : 0,
        timeline: formData.timeline,
        additionalInfo: formData.additionalInfo,
        clientId: clientId
      };
      
      console.log('🔍 Datos del usuario:', user);
      console.log('🔍 Client ID usado:', clientId);
      console.log('🔍 Datos del presupuesto a enviar:', budgetData);
      
      // Crear presupuesto en el backend
      const newBudget = await budgetService.createBudgetForClient(clientId, budgetData);
      
      console.log('Presupuesto creado exitosamente:', newBudget);
      
      // Llamar al callback con los datos del presupuesto creado
      onSubmit && onSubmit(newBudget);
      onClose();
      
      // Resetear formulario
      setFormData({
        title: '',
        description: '',
        serviceType: '',
        budget: '',
        timeline: '',
        additionalInfo: ''
      });
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      // Aquí se podría mostrar un mensaje de error al usuario
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {t('client.requestBudget')}
              </h2>
              <p className="text-gray-400 text-sm">
                Solicita un presupuesto personalizado para tu proyecto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Título del Proyecto *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Desarrollo de sitio web corporativo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Tipo de Servicio *
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar servicio</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Descripción del Proyecto *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe detalladamente tu proyecto, objetivos, funcionalidades requeridas..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Presupuesto Estimado
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: €5,000 - €10,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Timeline Estimado
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar timeline</option>
                {timelineOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Información Adicional
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Requisitos especiales, tecnologías preferidas, restricciones..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Enviar Solicitud</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestBudgetModal; 