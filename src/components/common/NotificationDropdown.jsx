import React, { useRef, useEffect, useState } from 'react';
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

const NotificationDropdown = ({ onClose, position = 'right', buttonRef }) => {
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead
  } = useNotifications();
  
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  // Calcular posición del dropdown basado en el botón
  useEffect(() => {
    if (buttonRef?.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: buttonRect.bottom + 8,
        right: window.innerWidth - buttonRect.right
      });
    }
  }, [buttonRef]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BUDGET':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'TICKET':
        return <TicketIcon className="h-5 w-5 text-orange-500" />;
      case 'PROJECT':
        return <FolderIcon className="h-5 w-5 text-green-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    await markAsRead(notificationId);
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const displayNotifications = unreadNotifications.slice(0, 5); // Mostrar solo las 5 más recientes

  const dropdownContent = (
    <div 
      ref={dropdownRef}
      className="fixed w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden"
      style={{
        position: 'fixed',
        zIndex: 999999,
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`,
        maxHeight: '24rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <BellIcon className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Notificaciones</h3>
          {unreadNotifications.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadNotifications.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {unreadNotifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              title="Marcar todas como leídas"
            >
              <CheckCircleIcon className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : displayNotifications.length === 0 ? (
          <div className="text-center py-8 px-4">
            <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No hay notificaciones nuevas</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
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
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        <span className="text-xs text-gray-400">
                          {formatDate(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Marcar como leída"
                          >
                            <CheckIcon className="h-3 w-3" />
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
      {notifications.length > 5 && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <button
            onClick={() => {
              // Aquí podrías abrir el modal completo
              onClose();
            }}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Ver todas las notificaciones ({notifications.length})
          </button>
        </div>
      )}
    </div>
  );

  // Usar portal para renderizar fuera del DOM actual
  return createPortal(dropdownContent, document.body);
};

export default NotificationDropdown;