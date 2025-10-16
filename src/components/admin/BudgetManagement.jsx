import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import budgetService from '../../services/budgetService';
import BudgetDetailsModal from './BudgetDetailsModal';

const BudgetManagement = () => {
  
  const [budgets, setBudgets] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('EN_REVISION');
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBudgetForDetails, setSelectedBudgetForDetails] = useState(null);
  const [responseData, setResponseData] = useState({
    status: '',
    responseNotes: '',
    approvedBudget: '',
    approvedTimeline: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Cargar estadísticas
        const stats = await budgetService.getBudgetStatistics();
        setStatistics(stats);
        
        // Cargar presupuestos por estado
        const budgetsData = await budgetService.getBudgetsByStatus(filterStatus);
        setBudgets(Array.isArray(budgetsData) ? budgetsData : []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        // En caso de error, mostrar datos de ejemplo
        setStatistics({
          total: 3,
          pending: 0,
          inReview: 3,
          approved: 0,
          rejected: 0
        });
        
        // Datos de ejemplo para presupuestos en revisión
        const mockBudgets = [
          {
            id: 1,
            title: "Desarrollo de aplicación móvil",
            description: "App para gestión de citas médicas con integración de calendario",
            serviceType: "Desarrollo Móvil",
            budget: 15000,
            timeline: "3-4 meses",
            additionalInfo: "Requiere integración con Google Calendar y sistema de pagos",
            clientId: 2,
            clientName: "Clínica Médica ABC",
            status: "EN_REVISION",
            statusDisplay: "En Revisión",
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-16T14:20:00Z",
            responseDate: null,
            responseNotes: null,
            approvedBudget: null,
            approvedTimeline: null
          },
          {
            id: 2,
            title: "Sitio web corporativo",
            description: "Rediseño completo del sitio web con nueva identidad visual",
            serviceType: "Desarrollo Web",
            budget: 8000,
            timeline: "2-3 meses",
            additionalInfo: "Necesita ser responsive y optimizado para SEO",
            clientId: 3,
            clientName: "Empresa XYZ",
            status: "EN_REVISION",
            statusDisplay: "En Revisión",
            createdAt: "2024-01-14T09:15:00Z",
            updatedAt: "2024-01-15T16:45:00Z",
            responseDate: null,
            responseNotes: null,
            approvedBudget: null,
            approvedTimeline: null
          },
          {
            id: 3,
            title: "Sistema de gestión empresarial",
            description: "Plataforma completa para gestión de inventario y ventas",
            serviceType: "Consultoría IT",
            budget: 25000,
            timeline: "6-8 meses",
            additionalInfo: "Incluye capacitación del personal y soporte técnico",
            clientId: 4,
            clientName: "Distribuidora Industrial",
            status: "EN_REVISION",
            statusDisplay: "En Revisión",
            createdAt: "2024-01-13T11:00:00Z",
            updatedAt: "2024-01-14T13:30:00Z",
            responseDate: null,
            responseNotes: null,
            approvedBudget: null,
            approvedTimeline: null
          }
        ];
        
        // Filtrar por estado actual
        const filteredBudgets = mockBudgets.filter(budget => budget.status === filterStatus);
        setBudgets(filteredBudgets);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [filterStatus]);

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

  const showSuccessMessage = (text) => {
    setMessage({ type: 'success', text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const showErrorMessage = (text) => {
    setMessage({ type: 'error', text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleStatusUpdate = async () => {
    try {
      setIsSubmitting(true);
      
      // Verificar que selectedBudget existe y tiene id
      if (!selectedBudget || !selectedBudget.id) {
        showErrorMessage('Error: Presupuesto no seleccionado o inválido');
        return;
      }
      
      await budgetService.updateBudgetStatus(selectedBudget.id, responseData);
      
      // Recargar lista de presupuestos
      const updatedBudgets = await budgetService.getBudgetsByStatus(filterStatus);
      setBudgets(Array.isArray(updatedBudgets) ? updatedBudgets : []);
      
      // Recargar estadísticas
      const updatedStats = await budgetService.getBudgetStatistics();
      setStatistics(updatedStats);
      
      setShowResponseForm(false);
      setSelectedBudget(null);
      setResponseData({
        status: '',
        responseNotes: '',
        approvedBudget: '',
        approvedTimeline: ''
      });
      
      showSuccessMessage('Estado del presupuesto actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      
      // Manejar diferentes tipos de error
      if (error.message && error.message.includes('HTTP error! status: 400')) {
        showErrorMessage('Datos inválidos. Verifica la información ingresada.');
      } else if (error.message && error.message.includes('HTTP error! status: 404')) {
        showErrorMessage('Presupuesto no encontrado.');
      } else if (error.message && error.message.includes('HTTP error! status: 500')) {
        showErrorMessage('Error del servidor. Intenta nuevamente.');
      } else {
        showErrorMessage('Error de conexión. Verifica tu internet.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    
    // Validar datos antes de enviar
    if (!responseData.status) {
      showErrorMessage('Debes seleccionar un estado');
      return;
    }
    
    if (!responseData.responseNotes || responseData.responseNotes.trim() === '') {
      showErrorMessage('Debes agregar notas de respuesta');
      return;
    }
    
    // Si es aprobación, validar campos adicionales
    if (responseData.status === 'APROBADO') {
      if (!responseData.approvedBudget || responseData.approvedBudget <= 0) {
        showErrorMessage('Debes especificar un presupuesto aprobado válido');
        return;
      }
      if (!responseData.approvedTimeline || responseData.approvedTimeline.trim() === '') {
        showErrorMessage('Debes especificar un timeline aprobado');
        return;
      }
    }
    
    await handleStatusUpdate();
  };

  const handleQuickAction = async (budget, action) => {
    // Verificar que budget sea válido
    if (!budget || !budget.id) {
      showErrorMessage('Error: Presupuesto inválido');
      return;
    }
    
    setSelectedBudget(budget);
    
    let newStatus = '';
    let notes = '';
    
    switch (action) {
      case 'approve':
        newStatus = 'APROBADO';
        notes = 'Presupuesto aprobado';
        break;
      case 'reject':
        newStatus = 'RECHAZADO';
        notes = 'Presupuesto rechazado';
        break;
      case 'review':
        newStatus = 'EN_REVISION';
        notes = 'Puesto en revisión';
        break;
      default:
        return;
    }
    
    setResponseData({
      status: newStatus,
      responseNotes: notes,
      approvedBudget: action === 'approve' ? budget.budget.toString() : '',
      approvedTimeline: action === 'approve' ? budget.timeline : ''
    });
    
    await handleStatusUpdate();
  };

  const handleViewDetails = (budget) => {
    setSelectedBudgetForDetails(budget);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Administración de Presupuestos
            </h1>
            <p className="text-gray-400">
              Gestiona y responde a las solicitudes de presupuesto de los clientes
            </p>
          </div>
        </div>
      </div>

      {/* Mensajes de estado */}
      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 mr-2" />
            ) : (
              <XCircleIcon className="h-5 w-5 mr-2" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Estadísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="stat-card">
            <h3 className="text-sm text-gray-400">Total</h3>
            <p className="text-2xl font-bold text-white">{statistics.total || 0}</p>
          </div>
          <div className="stat-card pending">
            <h3 className="text-sm text-gray-400">Pendientes</h3>
            <p className="text-2xl font-bold text-yellow-400">{statistics.pending || 0}</p>
          </div>
          <div className="stat-card in-review">
            <h3 className="text-sm text-gray-400">En Revisión</h3>
            <p className="text-2xl font-bold text-blue-400">{statistics.inReview || 0}</p>
          </div>
          <div className="stat-card approved">
            <h3 className="text-sm text-gray-400">Aprobados</h3>
            <p className="text-2xl font-bold text-green-400">{statistics.approved || 0}</p>
          </div>
          <div className="stat-card rejected">
            <h3 className="text-sm text-gray-400">Rechazados</h3>
            <p className="text-2xl font-bold text-red-400">{statistics.rejected || 0}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-200">Filtrar por estado:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PENDIENTE">Pendientes</option>
              <option value="EN_REVISION">En Revisión</option>
              <option value="APROBADO">Aprobados</option>
              <option value="RECHAZADO">Rechazados</option>
              <option value="CANCELADO">Cancelados</option>
            </select>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Presupuestos mostrados</p>
            <p className="text-2xl font-bold text-white">{budgets.length}</p>
          </div>
        </div>
      </div>

      {/* Lista de Presupuestos */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-400">No hay presupuestos para mostrar</h3>
              <p className="mt-1 text-sm text-gray-500">Cambia el filtro para ver otros estados</p>
            </div>
          ) : (
            budgets.map((budget) => {
              if (!budget || typeof budget !== 'object') return null;
              const budgetId = budget.id || 'unknown';
              const budgetTitle = budget.title || 'Sin título';
              const budgetDescription = budget.description || 'Sin descripción';
              const budgetStatus = budget.status || 'unknown';
              const budgetAmount = budget.budget || 0;
              const budgetClientName = budget.clientName || 'Cliente';
              const budgetServiceType = budget.serviceType || 'N/A';
              const budgetTimeline = budget.timeline || 'N/A';
              const budgetCreatedAt = budget.createdAt || new Date();
              const budgetAdditionalInfo = budget.additionalInfo || '';
              const budgetApprovedBudget = budget.approvedBudget || budgetAmount;
              const budgetApprovedTimeline = budget.approvedTimeline || budgetTimeline;
              const budgetResponseNotes = budget.responseNotes || '';
              return (
                <div 
                  key={budgetId} 
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-4 cursor-pointer hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200"
                  onClick={() => handleViewDetails(budget)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          {getStatusIcon(budgetStatus)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-white">{budgetTitle}</h3>
                              <p className="text-sm text-gray-400">{budgetDescription}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-white">€{budgetAmount.toLocaleString()}</p>
                              <p className="text-sm text-gray-400">ID: {budgetId}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-gray-400">Cliente</p>
                              <p className="text-sm text-white">{budgetClientName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Servicio</p>
                              <p className="text-sm text-white">{budgetServiceType}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Timeline</p>
                              <p className="text-sm text-white">{budgetTimeline}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Fecha</p>
                              <p className="text-sm text-white">{new Date(budgetCreatedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {budgetAdditionalInfo && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-400">Información Adicional:</p>
                              <p className="text-sm text-white">{budgetAdditionalInfo}</p>
                            </div>
                          )}
                          {budgetStatus === 'APROBADO' && (
                            <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
                              <p className="text-sm text-green-400"><strong>Presupuesto Aprobado:</strong> €{budgetApprovedBudget.toLocaleString()}</p>
                              <p className="text-sm text-green-400"><strong>Timeline Aprobado:</strong> {budgetApprovedTimeline}</p>
                            </div>
                          )}
                          {budgetResponseNotes && (
                            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                              <p className="text-sm text-blue-400"><strong>Respuesta:</strong> {budgetResponseNotes}</p>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 mt-4">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(budgetStatus)}`}>{getStatusText(budgetStatus)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleViewDetails(budget)} className="p-2 text-gray-400 hover:text-white transition-colors duration-200" title="Ver Detalles">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => { setSelectedBudget(budget); setShowResponseForm(true); }} className="p-2 text-gray-400 hover:text-white transition-colors duration-200" title="Responder">
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                      </button>
                      {budgetStatus === 'PENDIENTE' && (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); handleQuickAction(budget, 'approve'); }} disabled={isSubmitting} className={`p-2 transition-colors duration-200 ${isSubmitting ? 'text-gray-500 cursor-not-allowed' : 'text-green-400 hover:text-green-300'}`} title="Aprobar">
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleQuickAction(budget, 'reject'); }} disabled={isSubmitting} className={`p-2 transition-colors duration-200 ${isSubmitting ? 'text-gray-500 cursor-not-allowed' : 'text-red-400 hover:text-red-300'}`} title="Rechazar">
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleQuickAction(budget, 'review'); }} disabled={isSubmitting} className={`p-2 transition-colors duration-200 ${isSubmitting ? 'text-gray-500 cursor-not-allowed' : 'text-blue-400 hover:text-blue-300'}`} title="Poner en Revisión">
                            <ClockIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal de Respuesta */}
      {showResponseForm && selectedBudget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Responder Presupuesto
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {selectedBudget?.title || 'Presupuesto sin título'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResponseForm(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitResponse} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Estado *
                </label>
                <select
                  value={responseData.status}
                  onChange={(e) => setResponseData({
                    ...responseData,
                    status: e.target.value
                  })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar estado</option>
                  <option value="APROBADO">Aprobar</option>
                  <option value="RECHAZADO">Rechazar</option>
                  <option value="EN_REVISION">Poner en Revisión</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Notas de Respuesta *
                </label>
                <textarea
                  value={responseData.responseNotes}
                  onChange={(e) => setResponseData({
                    ...responseData,
                    responseNotes: e.target.value
                  })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Escribe tu respuesta al cliente..."
                  required
                />
              </div>

              {responseData.status === 'APROBADO' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Presupuesto Aprobado
                    </label>
                    <input
                      type="number"
                      value={responseData.approvedBudget}
                      onChange={(e) => setResponseData({
                        ...responseData,
                        approvedBudget: e.target.value
                      })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="€"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Timeline Aprobado
                    </label>
                    <input
                      type="text"
                      value={responseData.approvedTimeline}
                      onChange={(e) => setResponseData({
                        ...responseData,
                        approvedTimeline: e.target.value
                      })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 2-3 meses"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowResponseForm(false)}
                  className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    isSubmitting 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </div>
                  ) : (
                    'Enviar Respuesta'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalles del Presupuesto */}
      <BudgetDetailsModal
        budget={selectedBudgetForDetails}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBudgetForDetails(null);
        }}
      />
    </div>
  );
};

export default BudgetManagement; 