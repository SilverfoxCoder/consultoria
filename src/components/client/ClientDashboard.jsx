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

const ClientDashboard = () => {
  const { t } = useTranslations();
  const { user, clientId } = useAuth();

  // Estados para datos
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState([]);
  const [recentBudgets, setRecentBudgets] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);

  // Estados para modales
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);

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

        // Verificar si el backend respondió correctamente
        const hasBackendData = budgets.status === 'fulfilled' &&
          services.status === 'fulfilled' &&
          projects.status === 'fulfilled' &&
          tickets.status === 'fulfilled';

        if (hasBackendData) {
          console.log('✅ Backend disponible - usando datos reales');

          // Usar datos del backend
          const budgetsData = Array.isArray(budgets.value) ? budgets.value : [];
          const servicesData = Array.isArray(services.value) ? services.value : [];
          const projectsData = Array.isArray(projects.value) ? projects.value : [];
          const ticketsData = Array.isArray(tickets.value) ? tickets.value : [];

          // Calcular estadísticas reales
          const statsData = [
            {
              name: t('client.activeBudgets'),
              value: budgetsData.filter(b => b.status === 'pending' || b.status === 'approved').length.toString(),
              icon: DocumentTextIcon,
              color: 'text-blue-400',
              bgColor: 'bg-blue-400/10',
              change: '+2',
              changeType: 'positive'
            },
            {
              name: t('client.activeServices'),
              value: servicesData.filter(s => s.status === 'in-progress' || s.status === 'completed').length.toString(),
              icon: WrenchScrewdriverIcon,
              color: 'text-green-400',
              bgColor: 'bg-green-400/10',
              change: '+1',
              changeType: 'positive'
            },
            {
              name: t('client.activeProjects'),
              value: projectsData.filter(p => p.status === 'En Progreso').length.toString(),
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
              change: '-2',
              changeType: 'negative'
            }
          ];

          setStats(statsData);
          setRecentBudgets(budgetsData.slice(0, 3));
          setActiveProjects(projectsData.filter(p => p.status === 'En Progreso').slice(0, 2));
        } else {
          console.log('⚠️ Backend no disponible - usando datos mockeados');

          // Usar datos mockeados
          const statsData = [
            {
              name: t('client.activeBudgets'),
              value: '2',
              icon: DocumentTextIcon,
              color: 'text-blue-400',
              bgColor: 'bg-blue-400/10',
              change: '+2',
              changeType: 'positive'
            },
            {
              name: t('client.activeServices'),
              value: '2',
              icon: WrenchScrewdriverIcon,
              color: 'text-green-400',
              bgColor: 'bg-green-400/10',
              change: '+1',
              changeType: 'positive'
            },
            {
              name: t('client.activeProjects'),
              value: '2',
              icon: FolderIcon,
              color: 'text-purple-400',
              bgColor: 'bg-purple-400/10',
              change: '0',
              changeType: 'neutral'
            },
            {
              name: t('client.openTickets'),
              value: '1',
              icon: ExclamationTriangleIcon,
              color: 'text-orange-400',
              bgColor: 'bg-orange-400/10',
              change: '-2',
              changeType: 'negative'
            }
          ];

          const budgetsData = [
            { id: 'B001', title: 'Presupuesto Web', amount: '€5,000', status: 'approved' },
            { id: 'B002', title: 'Desarrollo App', amount: '€8,000', status: 'pending' },
            { id: 'B003', title: 'Consultoría IT', amount: '€3,000', status: 'approved' }
          ];

          const projectsData = [
            { id: 'P001', title: 'E-commerce Platform', status: 'En Progreso', progress: 65, dueDate: '2024-02-15' },
            { id: 'P002', title: 'Mobile App', status: 'En Progreso', progress: 30, dueDate: '2024-03-01' }
          ];

          setStats(statsData);
          setRecentBudgets(budgetsData);
          setActiveProjects(projectsData);
        }
      } catch (error) {
        console.log('❌ Error al cargar datos - usando datos mockeados');
        console.error('Error:', error);

        // Usar datos mockeados por defecto
        const activeBudgets = 0;
        const activeServices = 0;
        const activeProjects = 0;
        const openTickets = 0;

        const statsData = [
          {
            name: t('client.activeBudgets'),
            value: activeBudgets.toString(),
            icon: DocumentTextIcon,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
            change: activeBudgets > 0 ? `+${activeBudgets}` : '0',
            changeType: activeBudgets > 0 ? 'positive' : 'neutral'
          },
          {
            name: t('client.activeServices'),
            value: activeServices.toString(),
            icon: WrenchScrewdriverIcon,
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
            change: activeServices > 0 ? `+${activeServices}` : '0',
            changeType: activeServices > 0 ? 'positive' : 'neutral'
          },
          {
            name: t('client.activeProjects'),
            value: activeProjects.toString(),
            icon: FolderIcon,
            color: 'text-purple-400',
            bgColor: 'bg-purple-400/10',
            change: activeProjects > 0 ? `+${activeProjects}` : '0',
            changeType: activeProjects > 0 ? 'positive' : 'neutral'
          },
          {
            name: t('client.openTickets'),
            value: openTickets.toString(),
            icon: ExclamationTriangleIcon,
            color: 'text-orange-400',
            bgColor: 'bg-orange-400/10',
            change: openTickets > 0 ? `+${openTickets}` : '0',
            changeType: openTickets > 0 ? 'positive' : 'neutral'
          }
        ];

        const budgetsData = [
          { id: 'B001', title: 'Presupuesto Web', amount: '€5,000', status: 'approved' },
          { id: 'B002', title: 'Desarrollo App', amount: '€8,000', status: 'pending' },
          { id: 'B003', title: 'Consultoría IT', amount: '€3,000', status: 'approved' }
        ];

        const projectsData = [
          { id: 'P001', title: 'E-commerce Platform', status: 'En Progreso', progress: 65, dueDate: '2024-02-15' },
          { id: 'P002', title: 'Mobile App', status: 'En Progreso', progress: 30, dueDate: '2024-03-01' }
        ];

        setStats(statsData);
        setRecentBudgets(budgetsData);
        setActiveProjects(projectsData);
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
        return 'text-blue-400 bg-blue-400/10';
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
        return t('client.inProgress');
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
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t('client.progress')}</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {t('client.dueDate')}: {project.dueDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
    </div>
  );
};

export default ClientDashboard; 