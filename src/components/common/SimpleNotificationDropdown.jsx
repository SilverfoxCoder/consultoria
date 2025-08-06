import React, { useRef, useEffect } from 'react';
import { 
  XMarkIcon, 
  BellIcon,
  DocumentTextIcon,
  TicketIcon,
  FolderIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationContext';

const SimpleNotificationDropdown = ({ onClose }) => {
  const { notifications, isLoading, markAllAsRead } = useNotifications();
  const dropdownRef = useRef(null);

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

  const unreadNotifications = notifications.filter(n => !n.read);
  const displayNotifications = unreadNotifications.slice(0, 4);

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={{ 
        zIndex: 999999,
        transform: 'translateZ(0)', // Force new stacking context
        isolation: 'isolate' // Create new stacking context
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <BellIcon className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900 text-sm">Notificaciones</h3>
          {unreadNotifications.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {unreadNotifications.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {unreadNotifications.length > 0 && (
            <button
              onClick={markAllAsRead}
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
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : displayNotifications.length === 0 ? (
          <div className="text-center py-8 px-4">
            <BellIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No hay notificaciones nuevas</p>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 4 && (
        <div className="border-t border-gray-200 p-2 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full text-center text-xs text-blue-600 hover:text-blue-800 transition-colors py-1"
          >
            Ver todas ({notifications.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleNotificationDropdown;