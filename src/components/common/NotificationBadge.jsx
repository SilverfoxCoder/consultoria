import React, { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationOverlay from './NotificationOverlay';

const NotificationBadge = () => {
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const buttonRef = React.useRef(null);

  // Debug logging (temporal)
  console.log('🔔 NotificationBadge: unreadCount =', unreadCount, 'tipo:', typeof unreadCount);

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
        title="Notificaciones"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <NotificationOverlay onClose={handleClose} buttonPosition={buttonPosition} />
      )}
    </div>
  );
};

export default NotificationBadge; 