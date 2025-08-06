import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const ProjectDetails = ({ project, onBack, onUpdate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (project) {
      setEditData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || '',
        priority: project.priority || '',
        budget: project.budget || 0,
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        clientName: project.clientName || ''
      });
    }
  }, [project]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETADO':
        return 'text-green-400 bg-green-400/10';
      case 'EN_PROGRESO':
        return 'text-blue-400 bg-blue-400/10';
      case 'PLANIFICACION':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'PAUSADO':
        return 'text-orange-400 bg-orange-400/10';
      case 'CANCELADO':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETADO':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'EN_PROGRESO':
        return <ClockIcon className="h-5 w-5 text-blue-400" />;
      case 'PLANIFICACION':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case 'PAUSADO':
        return <XCircleIcon className="h-5 w-5 text-orange-400" />;
      case 'CANCELADO':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'ALTA':
        return 'text-red-400 bg-red-400/10';
      case 'MEDIA':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'BAJA':
        return 'text-green-400 bg-green-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const calculateProgress = () => {
    if (!project.spent || !project.budget) return 0;
    return Math.min((project.spent / project.budget) * 100, 100);
  };

  const calculateTimeProgress = () => {
    if (!project.startDate || !project.endDate) return 0;
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const handleSave = async () => {
    try {
      // Aquí se implementaría la actualización del proyecto
      console.log('Guardando cambios:', editData);
      setIsEditing(false);
      onUpdate && onUpdate(editData);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: project.name || '',
      description: project.description || '',
      status: project.status || '',
      priority: project.priority || '',
      budget: project.budget || 0,
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      clientName: project.clientName || ''
    });
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Proyecto no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="font-medium">Volver</span>
              </button>
              <div className="h-6 w-px bg-gray-600"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {isEditing ? 'Editando Proyecto' : project.name}
                </h1>
                <p className="text-gray-400 text-sm">
                  {project.clientName} • ID: {project.id}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors duration-200"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        Guardar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Eliminar</span>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar con información del proyecto */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  {getStatusIcon(project.status)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Estado</h3>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Prioridad</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Cliente</p>
                  <p className="text-white font-medium">{project.clientName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Presupuesto</p>
                  <p className="text-white font-medium">€{project.budget?.toLocaleString() || 0}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Gastado</p>
                  <p className="text-white font-medium">€{project.spent?.toLocaleString() || 0}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Fechas</p>
                  <div className="text-sm text-white">
                    <p>Inicio: {new Date(project.startDate).toLocaleDateString()}</p>
                    <p>Fin: {new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Acciones</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors duration-200">
                  <EyeIcon className="h-5 w-5" />
                  <span>Ver Reporte</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 transition-colors duration-200">
                  <PlusIcon className="h-5 w-5" />
                  <span>Agregar Tarea</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-purple-400 transition-colors duration-200">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  <span>Comentarios</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Tabs de navegación */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 mb-6">
              <div className="flex space-x-1 p-1">
                {[
                  { id: 'overview', name: 'Resumen', icon: EyeIcon },
                  { id: 'tasks', name: 'Tareas', icon: DocumentTextIcon },
                  { id: 'timeline', name: 'Cronograma', icon: CalendarIcon },
                  { id: 'budget', name: 'Presupuesto', icon: CurrencyEuroIcon },
                  { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
                  { id: 'settings', name: 'Configuración', icon: CogIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contenido de las tabs */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Descripción</h3>
                    {isEditing ? (
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-300">{project.description}</p>
                    )}
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <ChartBarIcon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Progreso</p>
                          <p className="text-2xl font-bold text-white">{calculateProgress().toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="mt-3 bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress()}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <CalendarIcon className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Tiempo</p>
                          <p className="text-2xl font-bold text-white">{calculateTimeProgress().toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="mt-3 bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateTimeProgress()}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <CurrencyEuroIcon className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Presupuesto</p>
                          <p className="text-2xl font-bold text-white">
                            {project.budget && project.spent 
                              ? ((project.spent / project.budget) * 100).toFixed(1)
                              : 0}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.budget && project.spent ? (project.spent / project.budget) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Información detallada */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Información del Proyecto</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Nombre</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) => setEditData({...editData, name: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="text-white">{project.name}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Estado</p>
                          {isEditing ? (
                            <select
                              value={editData.status}
                              onChange={(e) => setEditData({...editData, status: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="PLANIFICACION">Planificación</option>
                              <option value="EN_PROGRESO">En Progreso</option>
                              <option value="PAUSADO">Pausado</option>
                              <option value="COMPLETADO">Completado</option>
                              <option value="CANCELADO">Cancelado</option>
                            </select>
                          ) : (
                            <p className="text-white">{project.status}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Prioridad</p>
                          {isEditing ? (
                            <select
                              value={editData.priority}
                              onChange={(e) => setEditData({...editData, priority: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="BAJA">Baja</option>
                              <option value="MEDIA">Media</option>
                              <option value="ALTA">Alta</option>
                            </select>
                          ) : (
                            <p className="text-white">{project.priority}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Fechas y Presupuesto</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Fecha de Inicio</p>
                          {isEditing ? (
                            <input
                              type="date"
                              value={editData.startDate}
                              onChange={(e) => setEditData({...editData, startDate: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="text-white">{new Date(project.startDate).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Fecha de Fin</p>
                          {isEditing ? (
                            <input
                              type="date"
                              value={editData.endDate}
                              onChange={(e) => setEditData({...editData, endDate: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="text-white">{new Date(project.endDate).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Presupuesto Total</p>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editData.budget}
                              onChange={(e) => setEditData({...editData, budget: parseFloat(e.target.value)})}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="text-white">€{project.budget?.toLocaleString() || 0}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Tareas del Proyecto</h3>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
                      <PlusIcon className="h-4 w-4" />
                      <span>Nueva Tarea</span>
                    </button>
                  </div>
                  <div className="text-center py-12 text-gray-400">
                    <DocumentTextIcon className="h-12 w-12 mx-auto mb-4" />
                    <p>No hay tareas configuradas para este proyecto</p>
                    <button className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
                      Crear Primera Tarea
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Cronograma del Proyecto</h3>
                  <div className="text-center py-12 text-gray-400">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                    <p>Timeline no disponible</p>
                  </div>
                </div>
              )}

              {activeTab === 'budget' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Gestión de Presupuesto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-700/30 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Resumen Financiero</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Presupuesto Total:</span>
                          <span className="text-white font-semibold">€{project.budget?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gastado:</span>
                          <span className="text-white font-semibold">€{project.spent?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Restante:</span>
                          <span className="text-white font-semibold">€{((project.budget || 0) - (project.spent || 0)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Porcentaje Usado:</span>
                          <span className="text-white font-semibold">
                            {project.budget && project.spent 
                              ? ((project.spent / project.budget) * 100).toFixed(1)
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Gráfico de Presupuesto</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Presupuesto Usado</span>
                            <span className="text-white">
                              {project.budget && project.spent 
                                ? ((project.spent / project.budget) * 100).toFixed(1)
                                : 0}%
                            </span>
                          </div>
                          <div className="bg-gray-600 rounded-full h-3">
                            <div 
                              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${project.budget && project.spent ? (project.spent / project.budget) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Analytics del Proyecto</h3>
                  <div className="text-center py-12 text-gray-400">
                    <ChartBarIcon className="h-12 w-12 mx-auto mb-4" />
                    <p>Analytics no disponibles</p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Configuración del Proyecto</h3>
                  <div className="text-center py-12 text-gray-400">
                    <CogIcon className="h-12 w-12 mx-auto mb-4" />
                    <p>Configuración no disponible</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 