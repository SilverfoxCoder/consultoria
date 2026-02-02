import React, { useState } from 'react';
import { useTranslations } from '../../../hooks/useTranslations';
import { ExclamationTriangleIcon, XMarkIcon, PaperClipIcon } from '@heroicons/react/24/outline';

import { supportService } from '../../../services/supportService';
import { useAuth } from '../../../contexts/AuthContext';

const CreateTicketModal = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslations();
  const { user, clientId } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    category: '',
    project: '',
    attachments: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorityOptions = [
    { value: 'low', label: 'Baja', color: 'text-green-400' },
    { value: 'medium', label: 'Media', color: 'text-yellow-400' },
    { value: 'high', label: 'Alta', color: 'text-orange-400' },
    { value: 'urgent', label: 'Urgente', color: 'text-red-400' }
  ];

  const categoryOptions = [
    'Error técnico',
    'Solicitud de cambio',
    'Consulta general',
    'Problema de rendimiento',
    'Solicitud de nueva funcionalidad',
    'Problema de seguridad',
    'Otro'
  ];

  const projectOptions = [
    'Web citas Peluqueria',
    'Sistema de gestión',
    'Aplicación móvil',
    'Ninguno específico'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalClientId = clientId || user?.id || 1;
      const ticketData = {
        ...formData,
        clientId: finalClientId,
        status: 'open',
        // Handle attachments if supported by backend, otherwise they are just in state
      };

      console.log('Creando ticket:', ticketData);

      const newTicket = await supportService.createTicket(ticketData);

      onSubmit && onSubmit(newTicket);
      onClose();

      // Resetear formulario
      setFormData({
        title: '',
        description: '',
        priority: '',
        category: '',
        project: '',
        attachments: []
      });
      alert(t('client.ticketCreatedSuccess') || 'Ticket creado con éxito');
    } catch (error) {
      console.error('Error al crear ticket:', error);
      alert(t('client.errorCreatingTicket') || 'Error al crear el ticket');
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
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {t('client.createTicket')}
              </h2>
              <p className="text-gray-400 text-sm">
                Crea un ticket de soporte para resolver tu problema
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
                Título del Ticket *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ej: Error al cargar la página de inicio"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Prioridad *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar prioridad</option>
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Proyecto Relacionado
              </label>
              <select
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Seleccionar proyecto</option>
                {projectOptions.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Descripción Detallada *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Describe detalladamente el problema, incluye pasos para reproducirlo, mensajes de error, etc..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Archivos Adjuntos
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-orange-400 hover:text-orange-300 transition-colors duration-200"
              >
                <div className="space-y-2">
                  <PaperClipIcon className="h-8 w-8 mx-auto" />
                  <p className="text-sm">Haz clic para subir archivos</p>
                  <p className="text-xs text-gray-400">PNG, JPG, PDF, DOC hasta 10MB</p>
                </div>
              </label>
            </div>

            {/* Archivos seleccionados */}
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-200">Archivos seleccionados:</p>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                    <span className="text-sm text-gray-300">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>Crear Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal; 