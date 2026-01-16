import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import NotificationOverlay from './NotificationOverlay';

const AdminNotificationBadge = ({ onNavigateToNotifications }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const buttonRef = React.useRef(null);

  // Cargar notificaciones de admin
  const loadAdminNotifications = async () => {
    try {

      const response = await adminService.getAdminNotifications({
        page: 0,
        size: 50,
        sortBy: 'createdAt',
        sortDir: 'desc'
      });

      // Contar notificaciones no leídas
      const unread = response.content?.filter(n => !n.read).length || 0;
      setUnreadCount(unread);

      console.log('🔔 AdminNotificationBadge: Notificaciones cargadas:', response.content?.length || 0, 'No leídas:', unread);
    } catch (error) {
      console.error('❌ AdminNotificationBadge: Error al cargar notificaciones:', error);
    } finally {

    }
  };

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    loadAdminNotifications();
  }, []);

  // Escuchar nuevas notificaciones
  useEffect(() => {
    const handleNewNotification = () => {
      console.log('🔔 AdminNotificationBadge: Nueva notificación detectada, recargando...');
      loadAdminNotifications();
    };

    window.addEventListener('newNotification', handleNewNotification);
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, []);

  // Debug logging
  console.log('🔔 AdminNotificationBadge: unreadCount =', unreadCount, 'tipo:', typeof unreadCount);

  const handleClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition(rect);
    }
    setShowDropdown(!showDropdown);
  };

  const handleClose = () => {
    setShowDropdown(false);
    setButtonPosition(null);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200"
        title="Notificaciones de Administración"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <NotificationOverlay
          onClose={handleClose}
          buttonPosition={buttonPosition}
          isAdmin={true}
          onRefresh={loadAdminNotifications}
          onNavigateToNotifications={onNavigateToNotifications}
        />
      )}
    </div>
  );
};

export default AdminNotificationBadge; 