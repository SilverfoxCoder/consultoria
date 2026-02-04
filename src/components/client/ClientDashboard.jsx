import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import {
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  FolderIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ClockIcon,

} from '@heroicons/react/24/outline';
import budgetService from '../../services/budgetService';
import { serviceService } from '../../services/serviceService';
import { projectService } from '../../services/projectService';
import { supportService } from '../../services/supportService';
import { useAuth } from '../../contexts/AuthContext';
import RequestBudgetModal from './modals/RequestBudgetModal';
import CreateTicketModal from './modals/CreateTicketModal';
import RequestServiceModal from './modals/RequestServiceModal';
import ViewInvoicesModal from './modals/ViewInvoicesModal';
import ProjectDocumentsModal from './modals/ProjectDocumentsModal';

const ClientDashboard = () => {
  const { t } = useTranslations();
  const { user, clientId } = useAuth();

  // Estados para datos
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState([]);
  const [recentBudgets, setRecentBudgets] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);

  // Estados para modales
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const [selectedProjectForDocs, setSelectedProjectForDocs] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) return;
      setIsLoading(true);

      try {
        // Intentar cargar datos del backend primero
        const finalClientId = clientId || user?.id || 1;
        const [budgets, services, projects, tickets] = await Promise.allSettled([
          budgetService.getBudgetsByClient(finalClientId),
          serviceService.getServicesByClient(finalClientId),
          projectService.getProjectsByClient(finalClientId),
          supportService.getTicketsByClient(finalClientId)
        ]);

        // Procesar resultados individualmente
        const budgetsData = budgets.status === 'fulfilled' && Array.isArray(budgets.value) ? budgets.value : [];
        const servicesData = services.status === 'fulfilled' && Array.isArray(services.value) ? services.value : [];
        const projectsData = projects.status === 'fulfilled' && Array.isArray(projects.value) ? projects.value : [];
        const ticketsData = tickets.status === 'fulfilled' && Array.isArray(tickets.value) ? tickets.value : [];

        // Loggear errores si los hay
        if (budgets.status === 'rejected') console.error('Error loading budgets:', budgets.reason);
        if (services.status === 'rejected') console.error('Error loading services:', services.reason);
        if (projects.status === 'rejected') console.error('Error loading projects:', projects.reason);
        if (tickets.status === 'rejected') console.error('Error loading tickets:', tickets.reason);

        console.log('✅ Datos cargados (parcial o totalmente)');

        // Calcular estadísticas con los datos disponibles (reales o vacíos)
        const isActiveProject = (p) => {
          const status = p.status?.toUpperCase() || '';
          return status === 'EN PROGRESO' || status === 'PLANIFICACION' || status === 'IN-PROGRESS' || status === 'PLANNING';
        };

        const statsData = [
          {
            name: t('client.activeBudgets'),
            value: budgetsData.filter(b => b.status === 'pending' || b.status === 'approved').length.toString(),
            icon: DocumentTextIcon,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
            change: '+0', // Dato real no disponible para comparación histórica por ahora
            changeType: 'neutral'
          },
          {
            name: t('client.activeServices'),
            value: servicesData.filter(s => s.status === 'in-progress' || s.status === 'completed').length.toString(),
            icon: WrenchScrewdriverIcon,
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
            change: '+0',
            changeType: 'neutral'
          },
          {
            name: t('client.activeProjects'),
            value: projectsData.filter(isActiveProject).length.toString(),
            icon: FolderIcon,
            color: 'text-purple-400',
            bgColor: 'bg-purple-400/10',
            change: '0',
            changeType: 'neutral'
          },
          {
            name: t('client.openTickets'),
            value: ticketsData.filter(t => t.status === 'open').length.toString(),
            icon: ExclamationTriangleIcon,
            color: 'text-orange-400',
            bgColor: 'bg-orange-400/10',
            change: '0',
            changeType: 'neutral'
          }
        ];

        setStats(statsData);
        setRecentBudgets(budgetsData.slice(0, 3));
        setActiveProjects(projectsData.filter(isActiveProject).slice(0, 2));
        setRecentTickets(ticketsData.slice(0, 3));
      } catch (error) {
        console.error('❌ Error al cargar datos del dashboard:', error);
        // En caso de error, inicializar con arrays vacíos para evitar fallos de renderizado
        setStats([]);
        setRecentBudgets([]);
        setActiveProjects([]);
        setRecentTickets([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [clientId, user, t]); // Ejecutar cuando cambien user, clientId o t

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'approved':
        return 'text-green-400 bg-green-400/10';
      case 'rejected':
        return 'text-red-400 bg-red-400/10';
      case 'in-progress':
      case 'en progreso':
      case 'EN PROGRESO':
        return 'text-blue-400 bg-blue-400/10';
      case 'planning':
      case 'planificacion':
      case 'PLANIFICACION':
        return 'text-indigo-400 bg-indigo-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return t('client.pending');
      case 'approved':
        return t('client.approved');
      case 'rejected':
        return t('client.rejected');
      case 'in-progress':
      case 'en progreso':
      case 'EN PROGRESO':
        return t('client.inProgress');
      case 'planning':
      case 'planificacion':
      case 'PLANIFICACION':
        return t('client.planning');
      default:
        return status;
    }
  };

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



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-2">
          {t('client.welcomeBack')}, {user?.name || t('client.clientName')}
        </h1>
        <p className="text-gray-400">
          {t('client.dashboardSubtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm ${stat.changeType === 'positive' ? 'text-green-400' :
                    stat.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">
                    {t('client.fromLastMonth')}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Budgets */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {t('client.recentBudgets')}
              </h3>
              <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                {t('client.viewAll')}
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBudgets.map((budget) => (
                <div key={budget.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{budget.title}</p>
                        <p className="text-xs text-gray-400">{budget.id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{budget.amount}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                      {getStatusText(budget.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {t('client.activeProjects')}
              </h3>
              <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                {t('client.viewAll')}
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <FolderIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{project.title}</p>
                        <p className="text-xs text-gray-400">{project.id}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300 mt-2 line-clamp-2">
                      {project.description || t('client.noDescription')}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3 p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-400">Inversión Total</p>
                        <p className="text-sm font-medium text-white">€{project.budget?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Ejecutado</p>
                        <p className="text-sm font-medium text-white">€{project.spent?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm mt-3">
                      <span className="text-gray-400">{t('client.progress')}</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center text-xs text-gray-400 mt-2">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {t('client.dueDate')}: {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {t('client.openTickets') || 'Incidencias y Soporte'}
            </h3>
            <button onClick={() => setShowTicketModal(true)} className="text-primary-400 hover:text-primary-300 text-sm font-medium">
              + Nuevo Ticket
            </button>
          </div>
        </div>
        <div className="p-6">
          {recentTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Asunto</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Prioridad</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-400">#{ticket.id}</td>
                      <td className="px-3 py-4 text-sm text-white">{ticket.subject}</td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                            ${ticket.status === 'open' ? 'bg-green-400/10 text-green-400' :
                            ticket.status === 'in-progress' ? 'bg-blue-400/10 text-blue-400' : 'bg-gray-400/10 text-gray-400'}`}>
                          {ticket.status === 'open' ? 'Abierto' : ticket.status === 'in-progress' ? 'En Proceso' : 'Cerrado'}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`text-xs font-medium ${ticket.priority === 'high' ? 'text-red-400' :
                          ticket.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                          {ticket.priority?.toUpperCase() || 'MEDIA'}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(ticket.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No hay tickets recientes.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t('client.quickActions')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowBudgetModal(true)}
            className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
          >
            <DocumentTextIcon className="h-6 w-6 text-blue-400 mr-3" />
            <span className="text-white font-medium">{t('client.requestBudget')}</span>
          </button>
          <button
            onClick={() => setShowTicketModal(true)}
            className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
          >
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-400 mr-3" />
            <span className="text-white font-medium">{t('client.createTicket')}</span>
          </button>
          <button
            onClick={() => setShowServiceModal(true)}
            className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
          >
            <WrenchScrewdriverIcon className="h-6 w-6 text-green-400 mr-3" />
            <span className="text-white font-medium">{t('client.requestService')}</span>
          </button>
          <button
            onClick={() => setShowInvoicesModal(true)}
            className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
          >
            <CurrencyDollarIcon className="h-6 w-6 text-purple-400 mr-3" />
            <span className="text-white font-medium">{t('client.viewInvoices')}</span>
          </button>
        </div>
      </div>

      {/* Modales */}
      <RequestBudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSubmit={(data) => {
          console.log('Solicitud de presupuesto enviada:', data);
          // Aquí se manejaría la respuesta del backend
        }}
      />

      <CreateTicketModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        onSubmit={(data) => {
          console.log('Ticket creado:', data);
          // Aquí se manejaría la respuesta del backend
        }}
      />

      <RequestServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSubmit={(data) => {
          console.log('Solicitud de servicio enviada:', data);
          // Aquí se manejaría la respuesta del backend
        }}
      />

      <ViewInvoicesModal
        isOpen={showInvoicesModal}
        onClose={() => setShowInvoicesModal(false)}
      />

      <ProjectDocumentsModal
        isOpen={!!selectedProjectForDocs}
        onClose={() => setSelectedProjectForDocs(null)}
        project={selectedProjectForDocs}
      />
    </div >
  );
};

export default ClientDashboard; 