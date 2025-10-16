import React from 'react';
import { 
  XMarkIcon, 
  UserIcon, 
  CalendarIcon, 
  CurrencyEuroIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const BudgetDetailsModal = ({ budget, isOpen, onClose }) => {
  if (!isOpen || !budget) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APROBADO':
        return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
      case 'RECHAZADO':
        return <XCircleIcon className="h-6 w-6 text-red-400" />;
      case 'EN_REVISION':
        return <ClockIcon className="h-6 w-6 text-yellow-400" />;
      case 'PENDIENTE':
        return <ExclamationTriangleIcon className="h-6 w-6 text-blue-400" />;
      default:
        return <DocumentTextIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APROBADO':
        return 'bg-green-500/10 text-green-400 border-green-400/30';
      case 'RECHAZADO':
        return 'bg-red-500/10 text-red-400 border-red-400/30';
      case 'EN_REVISION':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-400/30';
      case 'PENDIENTE':
        return 'bg-blue-500/10 text-blue-400 border-blue-400/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APROBADO':
        return 'Aprobado';
      case 'RECHAZADO':
        return 'Rechazado';
      case 'EN_REVISION':
        return 'En Revisión';
      case 'PENDIENTE':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>

        {/* Modal */}
        <div className="relative inline-block w-full max-w-4xl">
          <div className="relative bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  {getStatusIcon(budget.status)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Detalles del Presupuesto</h2>
                  <p className="text-gray-400">ID: {budget.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Información Principal */}
                <div className="space-y-6">
                  <div className="bg-gray-700/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-400" />
                      Información General
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Título</label>
                        <p className="text-white font-medium">{budget.title || 'Sin título'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Descripción</label>
                        <p className="text-white">{budget.description || 'Sin descripción'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Estado</label>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(budget.status)}`}>
                          {getStatusText(budget.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-green-400" />
                      Información del Cliente
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Cliente</label>
                        <p className="text-white font-medium">{budget.clientName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Tipo de Servicio</label>
                        <p className="text-white">{budget.serviceType || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información Financiera y Temporal */}
                <div className="space-y-6">
                  <div className="bg-gray-700/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <CurrencyEuroIcon className="h-5 w-5 mr-2 text-purple-400" />
                      Información Financiera
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Presupuesto Solicitado</label>
                        <p className="text-2xl font-bold text-white">€{(budget.budget || 0).toLocaleString()}</p>
                      </div>
                      {budget.status === 'APROBADO' && budget.approvedBudget && (
                        <div>
                          <label className="text-sm text-gray-400">Presupuesto Aprobado</label>
                          <p className="text-xl font-bold text-green-400">€{budget.approvedBudget.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-orange-400" />
                      Información Temporal
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Timeline Solicitado</label>
                        <p className="text-white">{budget.timeline || 'N/A'}</p>
                      </div>
                      {budget.status === 'APROBADO' && budget.approvedTimeline && (
                        <div>
                          <label className="text-sm text-gray-400">Timeline Aprobado</label>
                          <p className="text-white text-green-400">{budget.approvedTimeline}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm text-gray-400">Fecha de Creación</label>
                        <p className="text-white">{formatDate(budget.createdAt)}</p>
                      </div>
                      {budget.updatedAt && budget.updatedAt !== budget.createdAt && (
                        <div>
                          <label className="text-sm text-gray-400">Última Actualización</label>
                          <p className="text-white">{formatDate(budget.updatedAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              {budget.additionalInfo && (
                <div className="mt-6 bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-400" />
                    Información Adicional
                  </h3>
                  <p className="text-white whitespace-pre-wrap">{budget.additionalInfo}</p>
                </div>
              )}

              {/* Respuesta del Admin */}
              {budget.responseNotes && (
                <div className="mt-6 bg-blue-500/10 rounded-xl p-6 border border-blue-400/30">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    Respuesta del Administrador
                  </h3>
                  <p className="text-blue-300 whitespace-pre-wrap">{budget.responseNotes}</p>
                </div>
              )}

              {/* Información de Aprobación */}
              {budget.status === 'APROBADO' && (
                <div className="mt-6 bg-green-500/10 rounded-xl p-6 border border-green-400/30">
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Información de Aprobación
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-green-300">Presupuesto Aprobado</label>
                      <p className="text-xl font-bold text-green-400">€{(budget.approvedBudget || budget.budget || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-green-300">Timeline Aprobado</label>
                      <p className="text-lg font-semibold text-green-400">{budget.approvedTimeline || budget.timeline || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDetailsModal;
