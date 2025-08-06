import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { Listbox } from '@headlessui/react';
import { 
  CloudIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { projectService } from '../../services/projectService';
import { clientService } from '../../services/clientService';
import ProjectDetails from './ProjectDetails';

const ProjectManagement = () => {
  const { t } = useTranslations();
  
  // Estados para gestión de proyectos
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' o 'edit'
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [projectsData, clientsData] = await Promise.all([
          projectService.getAllProjects(),
          clientService.getAllClients()
        ]);
        setProjects(projectsData);
        setClients(clientsData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  
  // Estados para Jira
  const [showJiraModal, setShowJiraModal] = useState(false);
  const [showJiraConfigModal, setShowJiraConfigModal] = useState(false);
  const [jiraConfig, setJiraConfig] = useState({
    url: '',
    email: '',
    apiToken: '',
    projectKey: '',
    boardId: ''
  });
  const [jiraData, setJiraData] = useState({
    issues: [],
    sprints: [],
    velocity: {},
    burndown: {}
  });

  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: '',
    clientName: '', // Changed from 'client' to 'clientName' to store client name instead of ID
    status: 'Planificación',
    startDate: '',
    endDate: '',
    budget: '',
    priority: 'Media',
    description: '',
    team: [],
    jiraIntegration: {
      enabled: false,
      url: '',
      projectKey: '',
      boardId: '',
      lastSync: null
    }
  });

  // Colores para estados
  const statusColors = {
    'Planificación': 'bg-blue-500',
    'En Progreso': 'bg-yellow-500',
    'En Revisión': 'bg-orange-500',
    'Completado': 'bg-green-500',
    'Cancelado': 'bg-red-500'
  };

  // Colores para prioridades
  const priorityColors = {
    'Baja': 'bg-gray-500',
    'Media': 'bg-blue-500',
    'Alta': 'bg-orange-500',
    'Crítica': 'bg-red-500'
  };

  const statusOptions = [
    { value: 'Planificación', label: t('projectManagement.filters.planning') },
    { value: 'En Progreso', label: t('projectManagement.filters.inProgress') },
    { value: 'En Revisión', label: t('projectManagement.filters.inReview') },
    { value: 'Completado', label: t('projectManagement.filters.completed') },
    { value: 'Cancelado', label: t('projectManagement.filters.cancelled') },
  ];
  const priorityOptions = [
    { value: 'Baja', label: t('projectManagement.priorities.low') },
    { value: 'Media', label: t('projectManagement.priorities.medium') },
    { value: 'Alta', label: t('projectManagement.priorities.high') },
    { value: 'Crítica', label: t('projectManagement.priorities.critical') },
  ];

  // Filtrar proyectos
  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'todos' || project.status === filterStatus;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (() => {
                           const client = clients.find(c => c.id === project.clientId);
                           return client ? client.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
                         })();
    return matchesStatus && matchesSearch;
  });

  // Calcular estadísticas
  const stats = {
    total: projects.length,
    enProgreso: projects.filter(p => 
      p.status === 'EN_PROGRESO' || 
      p.status === 'En Progreso' || 
      p.status === 'en_progress'
    ).length,
    completados: projects.filter(p => 
      p.status === 'COMPLETADO' || 
      p.status === 'Completado' || 
      p.status === 'completed'
    ).length,
    presupuestoTotal: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    gastadoTotal: projects.reduce((sum, p) => sum + (p.spent || 0), 0)
  };

  const handleAddProject = () => {
    setModalType('add');
    setFormData({
      name: '',
      clientName: '',
      status: 'Planificación',
      startDate: '',
      endDate: '',
      budget: '',
      priority: 'Media',
      description: '',
      team: [],
      jiraIntegration: {
        enabled: false,
        url: '',
        projectKey: '',
        boardId: '',
        lastSync: null
      }
    });
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setModalType('edit');
    setSelectedProject(project);
    
    // Buscar el nombre del cliente por ID
    const client = clients.find(c => c.id === project.clientId);
    const clientName = client ? client.name : '';
    
    setFormData({
      name: project.name,
      clientName: clientName, // Use client name instead of ID
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: project.budget.toString(),
      priority: project.priority,
      description: project.description,
      team: [...project.team],
      jiraIntegration: project.jiraIntegration || {
        enabled: false,
        url: '',
        projectKey: '',
        boardId: '',
        lastSync: null
      }
    });
    setShowModal(true);
  };

  const handleViewProjectDetails = (project) => {
    setCurrentProject(project);
    setShowProjectDetails(true);
  };

  const handleBackFromDetails = () => {
    setShowProjectDetails(false);
    setCurrentProject(null);
  };

  const handleUpdateProject = async (updatedData) => {
    try {
      // Aquí se implementaría la actualización del proyecto
      console.log('Actualizando proyecto:', updatedData);
      
      // Actualizar la lista de proyectos
      const updatedProjects = projects.map(p => 
        p.id === currentProject.id ? { ...p, ...updatedData } : p
      );
      setProjects(updatedProjects);
      
      // Cerrar la vista de detalles
      setShowProjectDetails(false);
      setCurrentProject(null);
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
    }
  };

  const handleSaveProject = async () => {
    try {
      setIsLoading(true);
      
      // Validar campos requeridos
      if (!formData.name || !formData.clientName || !formData.startDate || !formData.endDate || !formData.budget) {
        setError('Por favor, complete todos los campos requeridos');
        return;
      }
      
      // Buscar el cliente por nombre y obtener su ID
      const selectedClient = clients.find(client => client.name === formData.clientName);
      if (!selectedClient) {
        setError('El cliente seleccionado no existe');
        return;
      }
      
      const clientId = selectedClient.id;
      
      // Validar que el presupuesto sea un número válido
      const budgetValue = parseFloat(formData.budget);
      if (isNaN(budgetValue) || budgetValue <= 0) {
        setError('El presupuesto debe ser un número válido mayor a 0');
        return;
      }
      
      // Mapear los valores del frontend al formato esperado por el backend
      const statusMapping = {
        'Planificación': 'PLANIFICACION',
        'En Progreso': 'EN_PROGRESO',
        'Completado': 'COMPLETADO',
        'Cancelado': 'CANCELADO',
        'Pausado': 'PAUSADO'
      };
      
      const priorityMapping = {
        'Baja': 'BAJA',
        'Media': 'MEDIA',
        'Alta': 'ALTA',
        'Crítica': 'CRITICA'
      };
      
      // Usar el clientId ya validado
      
      const projectData = {
        name: formData.name,
        clientId: clientId, // ✅ Backend expects clientId (Long)
        status: statusMapping[formData.status] || 'PLANIFICACION', // ✅ Convert to uppercase enum
        progress: 0, // ✅ Add default progress
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: budgetValue,
        spent: 0, // ✅ Add default spent amount
        priority: priorityMapping[formData.priority] || 'MEDIA', // ✅ Convert to uppercase enum
        description: formData.description || ''
      };
      
      console.log('Sending project data:', projectData);
      
      if (modalType === 'add') {
        // Crear nuevo proyecto
        const newProject = await projectService.createProject(projectData);
        setProjects([...projects, newProject]);
      } else {
        // Actualizar proyecto existente
        const updatedProject = await projectService.updateProject(selectedProject.id, projectData);
        const updatedProjects = projects.map(p => 
          p.id === selectedProject.id ? updatedProject : p
        );
        setProjects(updatedProjects);
      }
      
      setShowModal(false);
      setSelectedProject(null);
      setFormData({
        name: '',
        clientName: '',
        status: 'Planificación',
        startDate: '',
        endDate: '',
        budget: '',
        priority: 'Media',
        description: '',
        team: [],
        jiraIntegration: {
          enabled: false,
          url: '',
          projectKey: '',
          boardId: '',
          lastSync: null
        }
      });
    } catch (err) {
      setError('Error al guardar el proyecto');
      console.error('Error saving project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm(t('projectManagement.modal.deleteConfirm'))) {
      try {
        setIsLoading(true);
        await projectService.deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (err) {
        setError('Error al eliminar el proyecto');
        console.error('Error deleting project:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Funciones para Jira
  const handleJiraConfig = (project) => {
    setSelectedProject(project);
    setJiraConfig({
      url: project.jiraIntegration?.url || '',
      email: '',
      apiToken: '',
      projectKey: project.jiraIntegration?.projectKey || '',
      boardId: project.jiraIntegration?.boardId || ''
    });
    setShowJiraConfigModal(true);
  };

  const handleSaveJiraConfig = () => {
    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id 
        ? {
            ...p,
            jiraIntegration: {
              enabled: true,
              url: jiraConfig.url,
              projectKey: jiraConfig.projectKey,
              boardId: jiraConfig.boardId,
              lastSync: new Date().toISOString()
            }
          }
        : p
    );
    setProjects(updatedProjects);
    setShowJiraConfigModal(false);
    setSelectedProject(null);
  };

  const handleViewJira = (project) => {
    setSelectedProject(project);
    // Simular datos de Jira
    setJiraData({
      issues: [
        {
          id: 'TECHRETAIL-123',
          key: 'TECHRETAIL-123',
          summary: 'Implementar carrito de compras',
          status: 'In Progress',
          assignee: 'Juan Pérez',
          priority: 'High',
          type: 'Story',
          created: '2024-01-15',
          updated: '2024-01-22'
        },
        {
          id: 'TECHRETAIL-124',
          key: 'TECHRETAIL-124',
          summary: 'Integrar pasarela de pagos',
          status: 'To Do',
          assignee: 'María García',
          priority: 'High',
          type: 'Story',
          created: '2024-01-16',
          updated: '2024-01-16'
        },
        {
          id: 'TECHRETAIL-125',
          key: 'TECHRETAIL-125',
          summary: 'Bug: Error en validación de formulario',
          status: 'Done',
          assignee: 'Carlos López',
          priority: 'Medium',
          type: 'Bug',
          created: '2024-01-18',
          updated: '2024-01-20'
        }
      ],
      sprints: [
        {
          id: 1,
          name: 'Sprint 1 - E-commerce Core',
          state: 'active',
          startDate: '2024-01-15',
          endDate: '2024-01-29',
          goal: 'Implementar funcionalidades core del e-commerce',
          completedIssues: 8,
          totalIssues: 12
        },
        {
          id: 2,
          name: 'Sprint 2 - Integración Pagos',
          state: 'future',
          startDate: '2024-01-30',
          endDate: '2024-02-13',
          goal: 'Integrar pasarelas de pago y gestión de inventario',
          completedIssues: 0,
          totalIssues: 15
        }
      ],
      velocity: {
        current: 8,
        average: 7.5,
        trend: 'up'
      },
      burndown: {
        remaining: 4,
        total: 12,
        daysLeft: 7
      }
    });
    setShowJiraModal(true);
  };

  const handleDisconnectJira = (projectId) => {
    if (window.confirm(t('projectManagement.jira.disconnectConfirm'))) {
      const updatedProjects = projects.map(p => 
        p.id === projectId 
          ? {
              ...p,
              jiraIntegration: {
                enabled: false,
                url: '',
                projectKey: '',
                boardId: '',
                lastSync: null
              }
            }
          : p
      );
      setProjects(updatedProjects);
    }
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{t('projectManagement.title')}</h1>
              <p className="text-gray-300 mt-1">{t('projectManagement.subtitle')}</p>
            </div>
            <button
              onClick={handleAddProject}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('projectManagement.newProject')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">{t('projectManagement.stats.totalProjects')}</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">{t('projectManagement.stats.inProgress')}</p>
                <p className="text-3xl font-bold text-white">{stats.enProgreso}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">{t('projectManagement.stats.completed')}</p>
                <p className="text-3xl font-bold text-white">{stats.completados}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">{t('projectManagement.stats.totalBudget')}</p>
                <p className="text-3xl font-bold text-white">€{(stats.presupuestoTotal || 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">{t('projectManagement.stats.totalSpent')}</p>
                <p className="text-3xl font-bold text-white">€{(stats.gastadoTotal || 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t('projectManagement.filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="todos">{t('projectManagement.filters.allStatuses')}</option>
                <option value="Planificación">{t('projectManagement.filters.planning')}</option>
                <option value="En Progreso">{t('projectManagement.filters.inProgress')}</option>
                <option value="En Revisión">{t('projectManagement.filters.inReview')}</option>
                <option value="Completado">{t('projectManagement.filters.completed')}</option>
                <option value="Cancelado">{t('projectManagement.filters.cancelled')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.table.project')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.table.client')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.table.status')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.table.progress')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.table.budget')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.table.priority')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{project.name}</div>
                        <div className="text-sm text-gray-300">{project.description.substring(0, 50)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {(() => {
                        const client = clients.find(c => c.id === project.clientId);
                        return client ? client.name : 'Cliente no encontrado';
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status]} text-white`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-300">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">
                        <div>€{(project.spent || 0).toLocaleString()} / €{(project.budget || 0).toLocaleString()}</div>
                        <div className="text-xs text-gray-400">
                          {project.budget && project.budget > 0 ? ((project.spent || 0) / project.budget * 100).toFixed(1) : 0}% usado
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[project.priority]} text-white`}>
                        {project.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProjectDetails(project)}
                          className="text-green-400 hover:text-green-300 transition-colors duration-200"
                          title="Ver detalles del proyecto"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          title="Editar proyecto"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {project.jiraIntegration?.enabled ? (
                          <>
                            <button
                              onClick={() => handleViewJira(project)}
                              className="text-green-400 hover:text-green-300 transition-colors duration-200"
                              title="Ver Jira"
                            >
                              <CloudIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDisconnectJira(project.id)}
                              className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
                              title="Desconectar Jira"
                            >
                              <ExclamationTriangleIcon className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleJiraConfig(project)}
                            className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                            title="Configurar Jira"
                          >
                            <CogIcon className="w-5 h-5" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          title="Eliminar proyecto"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para agregar/editar proyecto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {modalType === 'add' ? t('projectManagement.modal.newProject') : t('projectManagement.modal.editProject')}
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.modal.projectName')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.modal.client')}</label>
                  <Listbox value={formData.clientName} onChange={val => setFormData(prev => ({ ...prev, clientName: val }))}>
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left">
                        {formData.clientName || 'Seleccionar cliente'}
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none max-h-60 overflow-auto">
                        {clients.map(client => (
                          <Listbox.Option
                            key={client.id}
                            value={client.name}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none relative py-2 pl-4 pr-4 ${
                                active ? 'bg-gray-100 text-gray-800' : 'text-gray-800'
                              } ${selected ? 'font-semibold' : ''}`
                            }
                          >
                            {client.name}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.modal.status')}</label>
                  <Listbox value={formData.status} onChange={val => setFormData(prev => ({ ...prev, status: val }))}>
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left">
                        {statusOptions.find(opt => opt.value === formData.status)?.label}
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                        {statusOptions.map(option => (
                          <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none relative py-2 pl-4 pr-4 ${
                                active ? 'bg-gray-100 text-gray-800' : 'text-gray-800'
                              } ${selected ? 'font-semibold' : ''}`
                            }
                          >
                            {option.label}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.modal.priority')}</label>
                  <Listbox value={formData.priority} onChange={val => setFormData(prev => ({ ...prev, priority: val }))}>
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left">
                        {priorityOptions.find(opt => opt.value === formData.priority)?.label}
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                        {priorityOptions.map(option => (
                          <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none relative py-2 pl-4 pr-4 ${
                                active ? 'bg-gray-100 text-gray-800' : 'text-gray-800'
                              } ${selected ? 'font-semibold' : ''}`
                            }
                          >
                            {option.label}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.modal.startDate')}</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.modal.endDate')}</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.modal.budget')}</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.modal.description')}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </form>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
              >
                {t('projectManagement.modal.cancel')}
              </button>
              <button
                onClick={handleSaveProject}
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-medium transition-all duration-200"
              >
                {modalType === 'add' ? t('projectManagement.modal.createProject') : t('projectManagement.modal.saveChanges')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de configuración de Jira */}
      {showJiraConfigModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-white mb-6">{t('projectManagement.jira.configModal.title')}</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.jira.configModal.url')}</label>
                  <input
                    type="url"
                    value={jiraConfig.url}
                    onChange={(e) => setJiraConfig(prev => ({ ...prev, url: e.target.value }))}
                    placeholder={t('projectManagement.jira.configModal.urlPlaceholder')}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.jira.configModal.email')}</label>
                  <input
                    type="email"
                    value={jiraConfig.email}
                    onChange={(e) => setJiraConfig(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={t('projectManagement.jira.configModal.emailPlaceholder')}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.jira.configModal.apiToken')}</label>
                  <input
                    type="password"
                    value={jiraConfig.apiToken}
                    onChange={(e) => setJiraConfig(prev => ({ ...prev, apiToken: e.target.value }))}
                    placeholder={t('projectManagement.jira.configModal.apiTokenPlaceholder')}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.jira.configModal.projectKey')}</label>
                  <input
                    type="text"
                    value={jiraConfig.projectKey}
                    onChange={(e) => setJiraConfig(prev => ({ ...prev, projectKey: e.target.value }))}
                    placeholder={t('projectManagement.jira.configModal.projectKeyPlaceholder')}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('projectManagement.jira.configModal.boardId')}</label>
                  <input
                    type="text"
                    value={jiraConfig.boardId}
                    onChange={(e) => setJiraConfig(prev => ({ ...prev, boardId: e.target.value }))}
                    placeholder={t('projectManagement.jira.configModal.boardIdPlaceholder')}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-400">{t('projectManagement.jira.configModal.infoTitle')}</h3>
                    <div className="mt-2 text-sm text-blue-300">
                      <p>{t('projectManagement.jira.configModal.infoText')}</p>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        {t('projectManagement.jira.configModal.infoSteps').map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowJiraConfigModal(false)}
                className="px-6 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
              >
                {t('projectManagement.jira.configModal.cancel')}
              </button>
              <button
                onClick={handleSaveJiraConfig}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200"
              >
                {t('projectManagement.jira.configModal.saveConfig')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de vista de Jira */}
      {showJiraModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{t('projectManagement.jira.viewModal.title').replace('{projectName}', selectedProject?.name)}</h2>
                <p className="text-gray-300 mt-1">
                  {t('projectManagement.jira.viewModal.lastSync').replace('{date}', selectedProject?.jiraIntegration?.lastSync ? new Date(selectedProject.jiraIntegration.lastSync).toLocaleString() : 'Nunca')}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(selectedProject?.jiraIntegration?.url, '_blank')}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-2" />
                  {t('projectManagement.jira.viewModal.openInJira')}
                </button>
                <button
                  onClick={() => setShowJiraModal(false)}
                  className="px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                >
                  {t('projectManagement.jira.viewModal.close')}
                </button>
              </div>
            </div>

            {/* Métricas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">{t('projectManagement.jira.viewModal.metrics.totalIssues')}</p>
                    <p className="text-2xl font-bold text-white">{jiraData.issues.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">{t('projectManagement.jira.viewModal.metrics.activeSprints')}</p>
                    <p className="text-2xl font-bold text-white">{jiraData.sprints.filter(s => s.state === 'active').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">{t('projectManagement.jira.viewModal.metrics.currentVelocity')}</p>
                    <p className="text-2xl font-bold text-white">{jiraData.velocity.current}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">{t('projectManagement.jira.viewModal.metrics.pendingIssues')}</p>
                    <p className="text-2xl font-bold text-white">{jiraData.burndown.remaining}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Issues */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">{t('projectManagement.jira.viewModal.issues.title')}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.jira.viewModal.issues.issue')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.jira.viewModal.issues.summary')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.jira.viewModal.issues.status')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.jira.viewModal.issues.assignee')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.jira.viewModal.issues.priority')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('projectManagement.jira.viewModal.issues.type')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {jiraData.issues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <a 
                            href={`${selectedProject?.jiraIntegration?.url}/browse/${issue.key}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-medium"
                          >
                            {issue.key}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{issue.summary}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            issue.status === 'Done' ? 'bg-green-500 text-white' :
                            issue.status === 'In Progress' ? 'bg-yellow-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {issue.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{issue.assignee}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            issue.priority === 'High' ? 'bg-red-500 text-white' :
                            issue.priority === 'Medium' ? 'bg-orange-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {issue.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            issue.type === 'Story' ? 'bg-blue-500 text-white' :
                            issue.type === 'Bug' ? 'bg-red-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {issue.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sprints */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">{t('projectManagement.jira.viewModal.sprints.title')}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {jiraData.sprints.map((sprint) => (
                    <div key={sprint.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">{sprint.name}</h4>
                          <p className="text-gray-300 text-sm">{sprint.goal}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          sprint.state === 'active' ? 'bg-green-500 text-white' :
                          sprint.state === 'future' ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {sprint.state === 'active' ? t('projectManagement.jira.viewModal.sprints.states.active') : 
                           sprint.state === 'future' ? t('projectManagement.jira.viewModal.sprints.states.future') : 
                           t('projectManagement.jira.viewModal.sprints.states.completed')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-300">{t('projectManagement.jira.viewModal.sprints.startDate')}</p>
                          <p className="text-white">{new Date(sprint.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-300">{t('projectManagement.jira.viewModal.sprints.endDate')}</p>
                          <p className="text-white">{new Date(sprint.endDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-300">{t('projectManagement.jira.viewModal.sprints.completed')}</p>
                          <p className="text-white">{sprint.completedIssues}/{sprint.totalIssues}</p>
                        </div>
                        <div>
                          <p className="text-gray-300">{t('projectManagement.jira.viewModal.sprints.progress')}</p>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(sprint.completedIssues / sprint.totalIssues) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-white text-xs">
                              {Math.round((sprint.completedIssues / sprint.totalIssues) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista de detalles del proyecto */}
      {showProjectDetails && currentProject && (
        <ProjectDetails
          project={currentProject}
          onBack={handleBackFromDetails}
          onUpdate={handleUpdateProject}
        />
      )}
    </div>
  );
};

export default ProjectManagement; 