import React, { useState } from 'react';
import { 
  XMarkIcon, 
  CheckIcon, 
  TrashIcon, 
  BellIcon,
  DocumentTextIcon,
  TicketIcon,
  FolderIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationModal = ({ onClose }) => {
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BUDGET_PENDING':
      case 'BUDGET_APPROVED':
      case 'BUDGET_REJECTED':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'TICKET_NEW':
      case 'TICKET_UPDATED':
      case 'TICKET_RESOLVED':
        return <TicketIcon className="h-5 w-5 text-orange-500" />;
      case 'PROJECT_UPDATE':
      case 'PROJECT_MILESTONE':
      case 'PROJECT_COMPLETED':
        return <FolderIcon className="h-5 w-5 text-green-500" />;
      case 'TASK_ASSIGNED':
      case 'TASK_COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-purple-500" />;
      case 'SYSTEM_ANNOUNCEMENT':
        return <BellIcon className="h-5 w-5 text-red-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'Normal';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BellIcon className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Notificaciones
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                {isMarkingAll ? 'Marcando...' : 'Marcar todas como leídas'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setSelectedFilter('unread')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedFilter === 'unread'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              No leídas ({unreadCount})
            </button>
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Cargando notificaciones...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-6 text-center">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No hay notificaciones para mostrar</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors ${
                    notification.read ? 'bg-white' : 'bg-blue-50'
                  } ${getPriorityColor(notification.priority)} border-l-4`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            notification.read ? 'text-gray-900' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{formatDate(notification.createdAt)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              notification.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                              notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              notification.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {getPriorityText(notification.priority)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-3">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Marcar como leída"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {filteredNotifications.length} de {notifications.length} notificaciones
            </span>
            <span>
              {unreadCount} no leídas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal; 