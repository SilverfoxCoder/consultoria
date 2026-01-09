import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { 
  DocumentTextIcon, 
  PlusIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import RequestBudgetModal from './modals/RequestBudgetModal';
import budgetService from '../../services/budgetService';
import { useAuth } from '../../contexts/AuthContext';

const BudgetManagement = () => {
  const { t } = useTranslations();
  const { user, clientId } = useAuth();
  
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Cargar presupuestos del cliente
  useEffect(() => {
    const loadBudgets = async () => {
      setIsLoading(true);
      try {
        // Por ahora usamos el cliente ID 2 (Jose) como ejemplo
        // En una implementación real, esto vendría del contexto de autenticación
        const clientId = 2;
        const budgetsData = await budgetService.getBudgetsByClient(clientId);
        // Asegurar que budgetsData es un array
        setBudgets(Array.isArray(budgetsData) ? budgetsData : []);
      } catch (error) {
        console.error('Error al cargar presupuestos:', error);
        // En caso de error, mostrar datos de ejemplo
        setBudgets([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgets();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APROBADO':
        return 'text-green-400 bg-green-400/10';
      case 'PENDIENTE':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'EN_REVISION':
        return 'text-blue-400 bg-blue-400/10';
      case 'RECHAZADO':
        return 'text-red-400 bg-red-400/10';
      case 'CANCELADO':
        return 'text-gray-400 bg-gray-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APROBADO':
        return 'Aprobado';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'EN_REVISION':
        return 'En Revisión';
      case 'RECHAZADO':
        return 'Rechazado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APROBADO':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'PENDIENTE':
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
      case 'EN_REVISION':
        return <ClockIcon className="h-5 w-5 text-blue-400" />;
      case 'RECHAZADO':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'CANCELADO':
        return <XCircleIcon className="h-5 w-5 text-gray-400" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredBudgets = (Array.isArray(budgets) ? budgets : []).filter(budget => {
    if (filterStatus === 'all') return true;
    return budget.status === filterStatus;
  });

  const totalAmount = filteredBudgets.reduce((sum, budget) => sum + (budget.budget || 0), 0);

  const handleViewBudget = (budget) => {
    console.log('Viendo presupuesto:', budget.id);
    // Aquí se implementaría la vista previa del presupuesto
  };

  const handleDownloadBudget = (budget) => {
    console.log('Descargando presupuesto:', budget.id);
    // Aquí se implementaría la descarga del presupuesto
  };

  const handleBudgetSubmitted = async (data) => {
    console.log('Nuevo presupuesto solicitado:', data);
    
    try {
      // Usar el clientId del contexto de autenticación (recomendación implementada)
      const finalClientId = clientId || user?.id || 2; // Fallback al cliente de prueba si no hay clientId
      
      // Preparar datos para el backend
      const budgetData = {
        title: data.title,
        description: data.description,
        serviceType: data.serviceType,
        budget: data.budget ? parseFloat(data.budget.replace(/[^\d]/g, '')) : 0,
        timeline: data.timeline,
        additionalInfo: data.additionalInfo,
        clientId: finalClientId
      };
      
      // Crear presupuesto en el backend
      const newBudget = await budgetService.createBudgetForClient(finalClientId, budgetData);
      
      // Agregar el nuevo presupuesto a la lista
      setBudgets(prev => [newBudget, ...prev]);
      
      console.log('Presupuesto creado exitosamente:', newBudget);
    } catch (error) {
      console.error('Error al crear presupuesto:', error);
      // Aquí se podría mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Presupuestos
            </h1>
            <p className="text-gray-400">
              Gestiona y revisa todos tus presupuestos
            </p>
          </div>
          <button
            onClick={() => setShowBudgetModal(true)}
            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Solicitar Presupuesto
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-200">Filtrar por:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los presupuestos</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="EN_REVISION">En Revisión</option>
              <option value="APROBADO">Aprobados</option>
              <option value="RECHAZADO">Rechazados</option>
              <option value="CANCELADO">Cancelados</option>
            </select>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Presupuestos</p>
            <p className="text-2xl font-bold text-white">{filteredBudgets.length}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Total Presupuestos</p>
            <p className="text-2xl font-bold text-white">{filteredBudgets.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Monto Total</p>
            <p className="text-2xl font-bold text-white">€{totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Aprobados</p>
            <p className="text-2xl font-bold text-green-400">
              {Array.isArray(budgets) ? budgets.filter(b => b.status === 'APROBADO').length : 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-400">
              {Array.isArray(budgets) ? budgets.filter(b => b.status === 'PENDIENTE').length : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Budgets List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBudgets.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No hay presupuestos para mostrar</p>
              <button
                onClick={() => setShowBudgetModal(true)}
                className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Solicitar Primer Presupuesto
              </button>
            </div>
          ) : (
            filteredBudgets.map((budget) => (
              <div key={budget.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        {getStatusIcon(budget.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {budget.title}
                            </h3>
                            <p className="text-sm text-gray-400">{budget.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">
                              €{(budget.budget || 0).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400">
                              {budget.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 mt-2">
                          <span className="text-sm text-gray-400">
                            Tipo: {budget.serviceType}
                          </span>
                          <span className="text-sm text-gray-400">
                            Fecha: {new Date(budget.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-sm text-gray-400">
                            Vencimiento: {budget.responseDate ? new Date(budget.responseDate).toLocaleDateString() : 'Por definir'}
                          </span>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                            {getStatusText(budget.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewBudget(budget)}
                      className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                      title="Ver presupuesto"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                                          <button
                        onClick={() => handleDownloadBudget(budget)}
                        className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                        title="Descargar presupuesto"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      <RequestBudgetModal 
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSubmit={handleBudgetSubmitted}
      />
    </div>
  );
};

export default BudgetManagement; 