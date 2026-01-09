import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { 
  FolderIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon as CheckIconSolid } from '@heroicons/react/20/solid';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../contexts/AuthContext';
import ClientProjectDetails from './ClientProjectDetails';

const ClientProjects = () => {
  const { t } = useTranslations();
  const { user, clientId } = useAuth();
  
  // Estados para datos
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const finalClientId = clientId || user?.id || 1;
        const data = await projectService.getProjectsByClient(finalClientId);
        setProjects(data);
      } catch (err) {
        setError('Error al cargar los proyectos');
        console.error('Error loading projects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  const statusOptions = [
    { value: 'all', label: t('client.allStatuses') },
    { value: 'planning', label: t('client.planning') },
    { value: 'in-progress', label: t('client.inProgress') },
    { value: 'completed', label: t('client.completed') },
    { value: 'on-hold', label: t('client.onHold') }
  ];

  const sortOptions = [
    { value: 'date', label: t('client.date') },
    { value: 'progress', label: t('client.progress') },
    { value: 'status', label: t('client.status') },
    { value: 'title', label: t('client.title') }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'in-progress':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'on-hold':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'planning':
        return t('client.planning');
      case 'in-progress':
        return t('client.inProgress');
      case 'completed':
        return t('client.completed');
      case 'on-hold':
        return t('client.onHold');
      default:
        return status;
    }
  };

  const handleViewProjectDetails = (project) => {
    setCurrentProject(project);
    setShowProjectDetails(true);
  };

  const handleBackFromDetails = () => {
    setShowProjectDetails(false);
    setCurrentProject(null);
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'in-progress':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'pending':
        return 'text-gray-400 bg-gray-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const filteredProjects = projects
    .filter(project => {
      // Verificaciones robustas para evitar errores de undefined
      const title = project?.title || '';
      const description = project?.description || '';
      const id = project?.id ? String(project.id) : '';
      
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project?.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          const dateA = a?.startDate ? new Date(a.startDate) : new Date(0);
          const dateB = b?.startDate ? new Date(b.startDate) : new Date(0);
          return dateB - dateA;
        case 'progress':
          const progressA = a?.progress || 0;
          const progressB = b?.progress || 0;
          return progressB - progressA;
        case 'status':
          const statusA = a?.status || '';
          const statusB = b?.status || '';
          return statusA.localeCompare(statusB);
        case 'title':
          const titleA = a?.title || '';
          const titleB = b?.title || '';
          return titleA.localeCompare(titleB);
        default:
          return 0;
      }
    });

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {t('client.projects')}
            </h1>
            <p className="text-gray-400">
              {t('client.projectsSubtitle')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
              <CalendarIcon className="h-5 w-5 mr-2" />
              {t('client.projectTimeline')}
            </button>
            <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
              <FolderIcon className="h-5 w-5 mr-2" />
              {t('client.newProject')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-400/10">
              <FolderIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{t('client.totalProjects')}</p>
              <p className="text-2xl font-bold text-white">{projects.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-400/10">
              <ClockIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{t('client.inProgress')}</p>
              <p className="text-2xl font-bold text-white">
                {projects.filter(p => p.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-400/10">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{t('client.completed')}</p>
              <p className="text-2xl font-bold text-white">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-400/10">
              <UserGroupIcon className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{t('client.teamMembers')}</p>
              <p className="text-2xl font-bold text-white">
                {projects.reduce((sum, p) => sum + p.team.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('client.searchProjects')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <Listbox value={statusFilter} onChange={setStatusFilter}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <span className="block truncate text-white">
                  {statusOptions.find(option => option.value === statusFilter)?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {statusOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-primary-600 text-white' : 'text-gray-300'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-400">
                            <CheckIconSolid className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>

          {/* Sort */}
          <Listbox value={sortBy} onChange={setSortBy}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <span className="block truncate text-white">
                  {t('client.sortBy')}: {sortOptions.find(option => option.value === sortBy)?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {sortOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-primary-600 text-white' : 'text-gray-300'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-400">
                            <CheckIconSolid className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {t('client.projectsList')} ({filteredProjects.length})
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                {/* Project Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <FolderIcon className="h-8 w-8 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-white">{project?.title || 'Proyecto sin título'}</h4>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-1">{project?.description || 'Sin descripción'}</p>
                      <div className="flex items-center space-x-6 mt-3 text-sm text-gray-400">
                        <span>ID: {project?.id || 'N/A'}</span>
                        <span>{t('client.startDate')}: {project?.startDate || 'No definida'}</span>
                        <span>{t('client.dueDate')}: {project?.dueDate || 'No definida'}</span>
                        <span className="text-primary-400 font-semibold">€{(project.budget || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:ml-6">
                    <button 
                      onClick={() => handleViewProjectDetails(project)}
                      className="flex items-center justify-center px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      {t('client.viewDetails')}
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      {t('client.downloadReport')}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">{t('client.progress')}</span>
                                            <span className="text-sm text-white">{project?.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${project?.progress || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{t('client.spent')}: €{(project.spent || 0).toLocaleString()}</span>
                    <span>{t('client.remaining')}: €{((project.budget || 0) - (project.spent || 0)).toLocaleString()}</span>
                  </div>
                </div>

                {/* Team */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-300 mb-3">{t('client.projectTeam')}</h5>
                  <div className="flex flex-wrap gap-2">
                    {(project?.team || []).map((member, index) => (
                      <div key={index} className="flex items-center px-3 py-1 bg-gray-600 rounded-lg">
                        <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-white">{member?.name || 'Sin nombre'}</span>
                        <span className="text-xs text-gray-400 ml-2">({member?.role || 'Sin rol'})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks and Deliverables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Tasks */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-300 mb-3">{t('client.tasks')}</h5>
                    <div className="space-y-2">
                      {(project?.tasks || []).map((task, index) => (
                        <div key={task?.id || index} className="flex items-center justify-between p-2 bg-gray-600/30 rounded">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task?.status)}`}>
                              {task?.status === 'completed' ? t('client.completed') : 
                               task?.status === 'in-progress' ? t('client.inProgress') : t('client.pending')}
                            </span>
                            <span className="text-sm text-white">{task?.title || 'Tarea sin título'}</span>
                          </div>
                          <span className="text-xs text-gray-400">{task?.assignee || 'Sin asignar'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-300 mb-3">{t('client.deliverables')}</h5>
                    <div className="space-y-2">
                      {project.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-600/30 rounded">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(deliverable.status)}`}>
                              {deliverable.status === 'delivered' ? t('client.delivered') : 
                               deliverable.status === 'ready' ? t('client.ready') : 
                               deliverable.status === 'in-progress' ? t('client.inProgress') : t('client.pending')}
                            </span>
                            <span className="text-sm text-white">{deliverable.name}</span>
                          </div>
                          <span className="text-xs text-gray-400">{deliverable.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-400">{t('client.noProjectsFound')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('client.tryAdjustingFilters')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Vista de detalles del proyecto */}
      {showProjectDetails && currentProject && (
        <ClientProjectDetails
          project={currentProject}
          onBack={handleBackFromDetails}
        />
      )}
    </div>
  );
};

export default ClientProjects; 