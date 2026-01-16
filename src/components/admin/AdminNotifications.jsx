import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { adminService } from '../../services/adminService';

import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const AdminNotifications = () => {
  const { lang } = useTranslations();


  // Estados principales
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedNotification, setExpandedNotification] = useState(null);

  // Estados de paginación
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [size] = useState(20);

  // Estados de filtros
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Cargar notificaciones
  const loadNotifications = React.useCallback(async (pageNum = 0) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await adminService.getAdminNotifications({
        page: pageNum,
        size,
        sortBy,
        sortDir
      });

      setNotifications(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      setPage(pageNum);
    } catch (err) {
      console.error('Error loading admin notifications:', err);
      setError('Error al cargar las notificaciones');
    } finally {
      setIsLoading(false);
    }
  }, [size, sortBy, sortDir]);

  // Efecto para cargar notificaciones
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Efecto para actualizar notificaciones en tiempo real
  useEffect(() => {
    const handleNewNotification = () => {
      // Recargar notificaciones cuando llegue una nueva
      loadNotifications();
    };

    window.addEventListener('newNotification', handleNewNotification);
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, [loadNotifications]);

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadNotifications(newPage);
    }
  };



  // Obtener icono según el tipo de notificación
  const getNotificationIcon = (type) => {
    const notificationTypes = adminService.getNotificationTypes();
    const typeInfo = notificationTypes[type];

    if (!typeInfo) {
      return <BellIcon className="h-5 w-5 text-gray-500" />;
    }

    const iconClasses = `h-5 w-5 text-${typeInfo.color}-500`;

    switch (type) {
      case 'SYSTEM_ERROR':
        return <ExclamationTriangleIcon className={iconClasses} />;
      case 'USER_REGISTRATION':
      case 'FIRST_LOGIN':
        return <CheckCircleIcon className={iconClasses} />;
      default:
        return <InformationCircleIcon className={iconClasses} />;
    }
  };

  // Obtener estilos según la prioridad
  const getPriorityStyles = (priority) => {
    const priorities = adminService.getPriorities();
    return priorities[priority] || priorities.LOW;
  };

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = typeFilter === 'all' || notification.type === typeFilter;
    const priorityMatch = priorityFilter === 'all' || notification.priority === priorityFilter;
    return typeMatch && priorityMatch;
  });

  // Render de loading
  if (isLoading && notifications.length === 0) {
    return (
      <div className="min-h-screen relative z-10">
        <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              {lang === 'es' ? 'Notificaciones de Administración' : 'Admin Notifications'}
            </h1>
            <p className="text-gray-300 mt-1">
              {lang === 'es' ? 'Gestiona las notificaciones del sistema' : 'Manage system notifications'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-400">
              {lang === 'es' ? 'Cargando notificaciones...' : 'Loading notifications...'}
            </span>
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
              <h1 className="text-3xl font-bold text-white">
                {lang === 'es' ? 'Notificaciones de Administración' : 'Admin Notifications'}
              </h1>
              <p className="text-gray-300 mt-1">
                {lang === 'es' ? 'Gestiona las notificaciones del sistema' : 'Manage system notifications'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-white">{totalElements}</p>
              <p className="text-sm text-gray-300">
                {lang === 'es' ? 'Notificaciones totales' : 'Total notifications'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controles y Filtros */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {lang === 'es' ? 'Tipo' : 'Type'}
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">{lang === 'es' ? 'Todos' : 'All'}</option>
                <option value="USER_REGISTRATION">{lang === 'es' ? 'Registros' : 'Registrations'}</option>
                <option value="FIRST_LOGIN">{lang === 'es' ? 'Primeros Logins' : 'First Logins'}</option>
                <option value="BUDGET_REQUEST">{lang === 'es' ? 'Presupuestos' : 'Budget Requests'}</option>
                <option value="DAILY_STATS">{lang === 'es' ? 'Estadísticas Diarias' : 'Daily Stats'}</option>
                <option value="WEEKLY_STATS">{lang === 'es' ? 'Estadísticas Semanales' : 'Weekly Stats'}</option>
                <option value="MONTHLY_STATS">{lang === 'es' ? 'Estadísticas Mensuales' : 'Monthly Stats'}</option>
                <option value="SYSTEM_ERROR">{lang === 'es' ? 'Errores' : 'Errors'}</option>
                <option value="UNUSUAL_ACTIVITY">{lang === 'es' ? 'Actividad Inusual' : 'Unusual Activity'}</option>
              </select>
            </div>

            {/* Filtro por Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {lang === 'es' ? 'Prioridad' : 'Priority'}
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">{lang === 'es' ? 'Todas' : 'All'}</option>
                <option value="LOW">{lang === 'es' ? 'Baja' : 'Low'}</option>
                <option value="MEDIUM">{lang === 'es' ? 'Media' : 'Medium'}</option>
                <option value="HIGH">{lang === 'es' ? 'Alta' : 'High'}</option>
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {lang === 'es' ? 'Ordenar por' : 'Sort by'}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="createdAt">{lang === 'es' ? 'Fecha' : 'Date'}</option>
                <option value="type">{lang === 'es' ? 'Tipo' : 'Type'}</option>
                <option value="priority">{lang === 'es' ? 'Prioridad' : 'Priority'}</option>
              </select>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {lang === 'es' ? 'Dirección' : 'Direction'}
              </label>
              <button
                onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center gap-2"
              >
                {sortDir === 'asc' ? (
                  <>
                    <ChevronUpIcon className="h-4 w-4" />
                    {lang === 'es' ? 'Ascendente' : 'Ascending'}
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="h-4 w-4" />
                    {lang === 'es' ? 'Descendente' : 'Descending'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Lista de Notificaciones */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
              <BellIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {lang === 'es' ? 'No hay notificaciones' : 'No notifications found'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const priorityStyles = getPriorityStyles(notification.priority);
              const notificationTypes = adminService.getNotificationTypes();
              const typeInfo = notificationTypes[notification.type];

              return (
                <div
                  key={notification.id}
                  className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Icono */}
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {typeInfo?.name || notification.type}
                            </h3>

                            {/* Badge de Prioridad */}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles.bgColor} ${priorityStyles.textColor} ${priorityStyles.borderColor} border`}>
                              {priorityStyles.name}
                            </span>
                          </div>

                          <p className="text-gray-300 mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>
                              {adminService.formatRelativeDate(notification.createdAt)}
                            </span>
                            {notification.targetRole && (
                              <span className="flex items-center gap-1">
                                <span>•</span>
                                <span>{notification.targetRole}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botón expandir */}
                      <button
                        onClick={() => setExpandedNotification(
                          expandedNotification === notification.id ? null : notification.id
                        )}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {expandedNotification === notification.id ? (
                          <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Detalles Expandidos */}
                    {expandedNotification === notification.id && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">ID:</span>
                            <span className="text-white ml-2">{notification.id}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">
                              {lang === 'es' ? 'Fecha completa:' : 'Full date:'}
                            </span>
                            <span className="text-white ml-2">
                              {adminService.formatFullDate(notification.createdAt)}
                            </span>
                          </div>
                          {notification.data && (
                            <div className="md:col-span-2">
                              <span className="text-gray-400">
                                {lang === 'es' ? 'Datos adicionales:' : 'Additional data:'}
                              </span>
                              <pre className="text-white bg-black/40 rounded-lg p-3 mt-2 overflow-x-auto text-xs">
                                {JSON.stringify(notification.data, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {lang === 'es'
                ? `Mostrando ${page * size + 1}-${Math.min((page + 1) * size, totalElements)} de ${totalElements}`
                : `Showing ${page * size + 1}-${Math.min((page + 1) * size, totalElements)} of ${totalElements}`
              }
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/60 transition-colors duration-200"
              >
                {lang === 'es' ? 'Anterior' : 'Previous'}
              </button>

              <span className="px-3 py-2 text-gray-400">
                {page + 1} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/60 transition-colors duration-200"
              >
                {lang === 'es' ? 'Siguiente' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;