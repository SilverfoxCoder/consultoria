import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../contexts/AuthContext';
import ProjectManagement from './admin/ProjectManagement';
import ClientManagement from './admin/ClientManagement';
import ReportsAnalytics from './admin/ReportsAnalytics';
import Settings from './admin/Settings';
import BudgetManagement from './admin/BudgetManagement';
import Prospects from './admin/Prospects';
import TestConnection from './TestConnection';
import SystemStatus from './SystemStatus';
import LanguageSelector from './LanguageSelector';
import AdminNotificationBadge from './common/AdminNotificationBadge';
import { projectService } from '../services/projectService';
import { clientService } from '../services/clientService';
import { analyticsService } from '../services/analyticsService';

const Dashboard = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [settingsTab, setSettingsTab] = useState('profile');
  const { t } = useTranslations();
  const { user, logout } = useAuth();

  // Estados para datos del dashboard
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalClients: 0,
    monthlyRevenue: 0
  });

  const handleLogout = () => {
    logout();
    onBack();
  };

  const handleActionClick = (actionId) => {
    if (actionId === 'projects') {
      setCurrentView('projects');
    } else if (actionId === 'clients') {
      setCurrentView('clients');
    } else if (actionId === 'budgets') {
      setCurrentView('budgets');
    } else if (actionId === 'test') {
      setCurrentView('test');
    } else if (actionId === 'reports') {
      setCurrentView('reports');
    } else if (actionId === 'settings') {
      setCurrentView('settings');
    } else if (actionId === 'prospects') {
      setCurrentView('prospects');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleNavigateToNotifications = () => {
    setCurrentView('settings');
    // El componente Settings tiene una pestaña de notificaciones
    // Pasamos un parámetro para indicar que debe abrir la pestaña de notificaciones
    setSettingsTab('notifications');
  };

  // Cargar estadísticas del dashboard
  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setIsLoading(true);

        // Cargar proyectos activos
        const projects = await projectService.getAllProjects();
        const activeProjects = projects.filter(p =>
          p.status === 'EN_PROGRESO' ||
          p.status === 'PLANIFICACION' ||
          p.status === 'En Progreso' ||
          p.status === 'Planificación' ||
          p.status === 'active' ||
          p.status === 'in_progress'
        ).length;

        // Cargar total de clientes
        const clients = await clientService.getAllClients();
        const totalClients = clients.length;

        // Cargar ingresos mensuales
        const analytics = await analyticsService.getDashboardKPIs();
        const monthlyRevenue = analytics.monthlyRevenue || 0;

        setStats({
          activeProjects,
          totalClients,
          monthlyRevenue
        });
      } catch (err) {
        setError('Error al cargar las estadísticas del dashboard');
        console.error('Error loading dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentView === 'dashboard') {
      loadDashboardStats();
    }
  }, [currentView]);

  const quickActions = [
    {
      id: 'projects',
      title: 'Gestión de Proyectos',
      description: 'Ver y gestionar proyectos activos',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'clients',
      title: 'Gestión de Clientes',
      description: 'Administrar base de datos de clientes',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'budgets',
      title: 'Gestión de Presupuestos',
      description: 'Administrar solicitudes de presupuesto',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'test',
      title: 'Test de Conectividad',
      description: 'Probar conexión con el backend',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'reports',
      title: 'Reportes y Analytics',
      description: 'Visualizar métricas, gráficas y actividad',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'prospects',
      title: 'Prospectos (Bot)',
      description: 'Buscar leads automáticamente',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Preferencias, empresa, usuarios y seguridad',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'from-gray-500 to-gray-600'
    }
  ];

  // Renderizar vista actual
  if (currentView === 'projects') {
    return (
      <div className="min-h-screen relative z-10">
        {/* Header para ProjectManagement */}
        <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Volver al Dashboard</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <AdminNotificationBadge onNavigateToNotifications={handleNavigateToNotifications} />
                <LanguageSelector />
                <div className="text-right">
                  <p className="text-sm text-gray-300">{t('dashboard.welcome')}</p>
                  <p className="text-white font-medium">{user?.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{t('dashboard.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <ProjectManagement />
      </div>
    );
  }

  if (currentView === 'clients') {
    return (
      <div className="h-screen flex flex-col overflow-hidden relative z-10">
        {/* Header para ClientManagement */}
        <div className="bg-black/40 backdrop-blur-sm border-b border-white/20 flex-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Volver al Dashboard</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <AdminNotificationBadge onNavigateToNotifications={handleNavigateToNotifications} />
                <LanguageSelector />
                <div className="text-right">
                  <p className="text-sm text-gray-300">{t('dashboard.welcome')}</p>
                  <p className="text-white font-medium">{user?.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{t('dashboard.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ClientManagement />
        </div>
      </div>
    );
  }

  if (currentView === 'budgets') {
    return (
      <div className="min-h-screen relative z-10">
        {/* Header para BudgetManagement */}
        <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Volver al Dashboard</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <AdminNotificationBadge onNavigateToNotifications={handleNavigateToNotifications} />
                <LanguageSelector />
                <div className="text-right">
                  <p className="text-sm text-gray-300">{t('dashboard.welcome')}</p>
                  <p className="text-white font-medium">{user?.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{t('dashboard.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BudgetManagement />
        </div>
      </div>
    );
  }

  if (currentView === 'test') {
    return (
      <div className="min-h-screen relative z-10">
        {/* Header para TestConnection */}
        <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Volver al Dashboard</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <AdminNotificationBadge onNavigateToNotifications={handleNavigateToNotifications} />
                <LanguageSelector />
                <div className="text-right">
                  <p className="text-sm text-gray-300">{t('dashboard.welcome')}</p>
                  <p className="text-white font-medium">{user?.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{t('dashboard.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TestConnection />
        </div>
      </div>
    );
  }

  if (currentView === 'reports') {
    return (
      <div className="min-h-screen relative z-10">
        {/* Header para ReportsAnalytics */}
        <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Volver al Dashboard</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <AdminNotificationBadge onNavigateToNotifications={handleNavigateToNotifications} />
                <LanguageSelector />
                <div className="text-right">
                  <p className="text-sm text-gray-300">{t('dashboard.welcome')}</p>
                  <p className="text-white font-medium">{user?.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{t('dashboard.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ReportsAnalytics />
        </div>
      </div>
    );
  }

  if (currentView === 'settings') {
    return (
      <div className="min-h-screen relative z-10">
        {/* Header para Settings */}
        <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Volver al Dashboard</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <AdminNotificationBadge onNavigateToNotifications={handleNavigateToNotifications} />
                <LanguageSelector />
                <div className="text-right">
                  <p className="text-sm text-gray-300">{t('dashboard.welcome')}</p>
                  <p className="text-white font-medium">{user?.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{t('dashboard.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Settings defaultTab={settingsTab} />
        </div>
      </div>
    );
  }

  if (currentView === 'prospects') {
    return (
      <div className="h-screen flex flex-col overflow-hidden relative z-10">
        {/* Header para Prospects */}
        <div className="bg-black/40 backdrop-blur-sm border-b border-white/20 flex-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Volver al Dashboard</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <AdminNotificationBadge onNavigateToNotifications={handleNavigateToNotifications} />
                <LanguageSelector />
                <div className="text-right">
                  <p className="text-sm text-gray-300">{t('dashboard.welcome')}</p>
                  <p className="text-white font-medium">{user?.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{t('dashboard.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <Prospects />
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
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">{t('dashboard.backToHome')}</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <AdminNotificationBadge onNavigateToNotifications={handleNavigateToNotifications} />
              <LanguageSelector />
              <div className="text-right">
                <p className="text-sm text-gray-300">{t('dashboard.welcome')}</p>
                <p className="text-white font-medium">{user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{t('dashboard.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-4">
              {t('dashboard.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('dashboard.subtitle')}
            </p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action) => (
            <div
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:shadow-lg transition-shadow duration-300`}>
                {action.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {action.title}
              </h3>
              <p className="text-gray-300 text-sm">
                {action.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-600 rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-600/30 rounded-xl animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('dashboard.stats.activeProjects')}</p>
                  <p className="text-3xl font-bold text-white">{stats.activeProjects}</p>
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
                  <p className="text-gray-300 text-sm">{t('dashboard.stats.totalClients')}</p>
                  <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('dashboard.stats.monthlyRevenue')}</p>
                  <p className="text-3xl font-bold text-white">€{stats.monthlyRevenue >= 1000 ? `${(stats.monthlyRevenue / 1000).toFixed(0)}K` : stats.monthlyRevenue}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Status Section */}
        <div className="mt-12">
          <SystemStatus />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 