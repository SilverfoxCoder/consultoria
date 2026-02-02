import React, { useState } from 'react';
import { useTranslations } from '../../../hooks/useTranslations';
import { WrenchScrewdriverIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { serviceService } from '../../../services/serviceService';
import { useAuth } from '../../../contexts/AuthContext';

const RequestServiceModal = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslations();
  const { user, clientId } = useAuth();

  const [formData, setFormData] = useState({
    serviceType: '',
    title: '',
    description: '',
    urgency: '',
    timeline: '',
    budget: '',
    requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    'Desarrollo Web',
    'Desarrollo Móvil',
    'Consultoría IT',
    'Servicios Cloud',
    'Inteligencia Artificial',
    'Ciberseguridad',
    'Mantenimiento',
    'Optimización',
    'Migración de datos',
    'Formación técnica',
    'Otro'
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Baja - Sin urgencia', color: 'text-green-400' },
    { value: 'medium', label: 'Media - Planificado', color: 'text-yellow-400' },
    { value: 'high', label: 'Alta - Necesario pronto', color: 'text-orange-400' },
    { value: 'urgent', label: 'Urgente - Crítico', color: 'text-red-400' }
  ];

  const timelineOptions = [
    'Inmediato',
    '1-2 semanas',
    '1 mes',
    '2-3 meses',
    '3-6 meses',
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
      const finalClientId = clientId || user?.id || 1;
      const serviceData = {
        ...formData,
        clientId: finalClientId,
        status: 'pending' // Default status
      };

      console.log('Solicitando servicio:', serviceData);

      const newService = await serviceService.createService(serviceData);

      onSubmit && onSubmit(newService);
      onClose();

      // Resetear formulario
      setFormData({
        serviceType: '',
        title: '',
        description: '',
        urgency: '',
        timeline: '',
        budget: '',
        requirements: ''
      });
      alert(t('client.serviceRequestedSuccess') || 'Servicio solicitado con éxito');

    } catch (error) {
      console.error('Error al solicitar servicio:', error);
      alert(t('client.errorRequestingService') || 'Error al solicitar el servicio');
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
            <div className="p-2 bg-green-500/20 rounded-lg">
              <WrenchScrewdriverIcon className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {t('client.requestService')}
              </h2>
              <p className="text-gray-400 text-sm">
                Solicita un servicio técnico o consultoría especializada
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
                Tipo de Servicio *
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar servicio</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Título del Servicio *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Optimización de base de datos"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Urgencia *
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar urgencia</option>
                {urgencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Timeline Deseado
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              Descripción del Servicio *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe detalladamente el servicio que necesitas, objetivos, alcance..."
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
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: €2,000 - €5,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Requisitos Especiales
              </label>
              <input
                type="text"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Certificaciones, tecnologías específicas..."
              />
            </div>
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
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <WrenchScrewdriverIcon className="h-4 w-4" />
                  <span>Solicitar Servicio</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestServiceModal; 