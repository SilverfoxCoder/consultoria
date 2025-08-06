import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  XMarkIcon, 
  CheckIcon, 
  BellIcon,
  DocumentTextIcon,
  TicketIcon,
  FolderIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationContext';
import { adminService } from '../../services/adminService';

const NotificationOverlay = ({ onClose, buttonPosition, isAdmin = false, onRefresh, onNavigateToNotifications }) => {
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const overlayRef = useRef(null);

  // Cargar notificaciones de admin si es necesario
  const loadAdminNotifications = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      setAdminLoading(true);
      const response = await adminService.getAdminNotifications({
        page: 0,
        size: 50,
        sortBy: 'createdAt',
        sortDir: 'desc'
      });
      setAdminNotifications(response.content || []);
    } catch (error) {
      console.error('❌ NotificationOverlay: Error al cargar notificaciones de admin:', error);
    } finally {
      setAdminLoading(false);
    }
  }, [isAdmin]);

  // Cargar notificaciones de admin al montar si es admin
  useEffect(() => {
    if (isAdmin) {
      loadAdminNotifications();
    }
  }, [isAdmin, loadAdminNotifications]);

  // Escuchar nuevas notificaciones si es admin
  useEffect(() => {
    if (!isAdmin) return;

    const handleNewNotification = () => {
      console.log('🔔 NotificationOverlay: Nueva notificación detectada, recargando...');
      loadAdminNotifications();
    };

    window.addEventListener('newNotification', handleNewNotification);
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, [isAdmin, loadAdminNotifications]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Delay para evitar que se cierre inmediatamente
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BUDGET':
        return <DocumentTextIcon className="h-4 w-4 text-blue-500" />;
      case 'TICKET':
        return <TicketIcon className="h-4 w-4 text-orange-500" />;
      case 'PROJECT':
        return <FolderIcon className="h-4 w-4 text-green-500" />;
      default:
        return <BellIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    try {
      if (isAdmin) {
        // Marcar como leída usando el servicio de admin
        await adminService.markAdminNotificationAsRead(notificationId);
        // Recargar las notificaciones
        await loadAdminNotifications();
      } else {
        await markAsRead(notificationId);
      }
    } catch (error) {
      console.error('❌ NotificationOverlay: Error al marcar como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (isAdmin) {
        // Marcar todas como leídas usando el servicio de admin
        await adminService.markAllAdminNotificationsAsRead();
        // Recargar las notificaciones
        await loadAdminNotifications();
      } else {
        await markAllAsRead();
      }
    } catch (error) {
      console.error('❌ NotificationOverlay: Error al marcar todas como leídas:', error);
    }
  };

  const handleDeleteNotification = async (notificationId, event) => {
    event.stopPropagation();
    try {
      if (isAdmin) {
        // Eliminar notificación usando el servicio de admin
        await adminService.deleteAdminNotification(notificationId);
        // Recargar las notificaciones
        await loadAdminNotifications();
      }
    } catch (error) {
      console.error('❌ NotificationOverlay: Error al eliminar notificación:', error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      if (isAdmin) {
        // Eliminar todas las notificaciones usando el servicio de admin
        await adminService.deleteAllAdminNotifications();
        // Recargar las notificaciones
        await loadAdminNotifications();
      }
    } catch (error) {
      console.error('❌ NotificationOverlay: Error al eliminar todas las notificaciones:', error);
    }
  };

  const handleViewAllNotifications = () => {
    if (isAdmin) {
      // Navegar al componente de notificaciones de admin
      // Esto requerirá pasar una función de navegación como prop
      if (onNavigateToNotifications) {
        onNavigateToNotifications();
      }
    }
    onClose();
  };

  // Usar las notificaciones correctas según el tipo
  const currentNotifications = isAdmin ? adminNotifications : notifications;
  const currentLoading = isAdmin ? adminLoading : isLoading;
  
  const unreadNotifications = currentNotifications.filter(n => !n.read);
  // Mostrar todas las notificaciones no leídas, no solo 4
  const displayNotifications = unreadNotifications;

  // Calcular posición del dropdown
  const dropdownStyle = {
    position: 'fixed',
    top: buttonPosition ? `${buttonPosition.bottom + 8}px` : '60px',
    right: buttonPosition ? `${window.innerWidth - buttonPosition.right}px` : '20px',
    zIndex: 999999,
    width: '320px',
    maxHeight: '500px'
  };

  const overlayContent = (
    <>
      {/* Backdrop invisible para cerrar */}
      <div 
        className="fixed inset-0" 
        style={{ zIndex: 999998 }}
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div 
        ref={overlayRef}
        className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
        style={dropdownStyle}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <BellIcon className="h-4 w-4 text-gray-600" />
            <h3 className="font-medium text-gray-900 text-sm">
              {isAdmin ? 'Notificaciones de Admin' : 'Notificaciones'}
            </h3>
            {unreadNotifications.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {isAdmin && currentNotifications.length > 0 && (
              <button
                onClick={handleDeleteAllNotifications}
                className="text-xs text-red-600 hover:text-red-800 transition-colors p-1"
                title="Vaciar bandeja"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            {unreadNotifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors p-1"
                title="Marcar todas como leídas"
              >
                <CheckCircleIcon className="h-3 w-3" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {currentLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : displayNotifications.length === 0 ? (
            <div className="text-center py-8 px-4">
              <BellIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {isAdmin ? 'No hay notificaciones de administración' : 'No hay notificaciones nuevas'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {!notification.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Marcar como leída"
                            >
                              <CheckIcon className="h-3 w-3" />
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Eliminar notificación"
                            >
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
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
        {currentNotifications.length > 4 && (
          <div className="border-t border-gray-200 p-2 bg-gray-50">
            <button
              onClick={handleViewAllNotifications}
              className="w-full text-center text-xs text-blue-600 hover:text-blue-800 transition-colors py-1"
            >
              Ver todas las notificaciones ({currentNotifications.length})
            </button>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(overlayContent, document.body);
};

export default NotificationOverlay;