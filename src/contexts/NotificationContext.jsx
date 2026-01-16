import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de un NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    byType: {},
    byPriority: {}
  });

  // Cargar notificaciones del usuario
  const loadNotifications = useCallback(async () => {
    if (!user?.id) {
      console.log('🔍 NotificationContext: No user.id disponible para cargar notificaciones');
      return;
    }

    console.log('🔍 NotificationContext: Cargando notificaciones para usuario:', user.id);
    setIsLoading(true);
    try {
      const data = await notificationService.getUserNotifications(user.id);
      console.log('🔍 NotificationContext: Datos recibidos:', data);
      setNotifications(data.content || []);
      const unread = data.content?.filter(n => !n.read).length || 0;
      setUnreadCount(unread);
      console.log('🔍 NotificationContext: Notificaciones cargadas:', data.content?.length || 0, 'No leídas:', unread);
    } catch (error) {
      console.error('❌ Error al cargar notificaciones:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Cargar estadísticas de notificaciones
  const loadStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const statsData = await notificationService.getNotificationStats(user.id);
      setStats(statsData);
      setUnreadCount(statsData.unread || 0);
    } catch (error) {
      console.error('Error al cargar estadísticas de notificaciones:', error);
    }
  }, [user?.id]);

  // Marcar notificación como leída
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  }, []);

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      console.log('🔄 NotificationContext: Marcando todas las notificaciones como leídas para usuario:', user.id);

      const response = await notificationService.markAllAsRead(user.id);

      if (response?.success) {
        console.log('✅ NotificationContext: Respuesta exitosa del backend:', response.message);

        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);

        // Opcional: Mostrar mensaje de éxito al usuario
        if (window.showToast) {
          window.showToast({
            message: response.message || 'Todas las notificaciones marcadas como leídas',
            type: 'success'
          });
        }
      } else {
        throw new Error(response?.message || 'Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('❌ NotificationContext: Error al marcar todas las notificaciones como leídas:', error);

      // Mostrar error al usuario
      if (window.showToast) {
        window.showToast({
          message: 'Error al marcar las notificaciones como leídas',
          type: 'error'
        });
      }
    }
  }, [user?.id]);

  // Eliminar notificación
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
      // Actualizar contador si la notificación no estaba leída
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  }, [notifications]);

  // Agregar nueva notificación (para notificaciones en tiempo real)
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  // Escuchar nuevas notificaciones desde WebSocket
  useEffect(() => {
    const handleNewNotification = (event) => {
      const notification = event.detail;
      addNotification(notification);
    };

    window.addEventListener('newNotification', handleNewNotification);
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, [addNotification]);

  // Inicializar WebSocket cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log('🚀 NotificationContext: Inicializando sistema de notificaciones para usuario:', user.id, 'Tipo:', user.role || 'unknown');
      notificationService.initializeWebSocket(user.id);

      // Cargar notificaciones y estadísticas
      loadNotifications();
      loadStats();

      return () => {
        console.log('🔌 NotificationContext: Cerrando WebSocket');
        notificationService.closeWebSocket();
      };
    } else {
      console.log('⏸️ NotificationContext: Usuario no autenticado o sin ID, saltando inicialización');
    }
  }, [isAuthenticated, user?.id, user?.role, loadNotifications, loadStats]);

  // Recargar notificaciones cuando cambia el usuario
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      loadStats();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setStats({
        total: 0,
        unread: 0,
        byType: {},
        byPriority: {}
      });
    }
  }, [user?.id, loadNotifications, loadStats]);

  // Función para crear notificación (para administradores)
  const createNotification = useCallback(async (notificationData) => {
    try {
      const newNotification = await notificationService.createNotification(notificationData);
      return newNotification;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw error;
    }
  }, []);

  // Función para notificar nuevo presupuesto
  const notifyNewBudget = useCallback(async (budgetId, clientId, budgetTitle) => {
    try {
      await notificationService.notifyNewBudget(budgetId, clientId, budgetTitle);
    } catch (error) {
      console.error('Error al notificar nuevo presupuesto:', error);
    }
  }, []);

  // Función para notificar actualización de presupuesto
  const notifyBudgetUpdate = useCallback(async (budgetId, clientId, status, budgetTitle) => {
    try {
      await notificationService.notifyBudgetUpdate(budgetId, clientId, status, budgetTitle);
    } catch (error) {
      console.error('Error al notificar actualización de presupuesto:', error);
    }
  }, []);

  // Función para notificar nuevo ticket
  const notifyNewTicket = useCallback(async (ticketId, clientId, ticketTitle) => {
    try {
      await notificationService.notifyNewTicket(ticketId, clientId, ticketTitle);
    } catch (error) {
      console.error('Error al notificar nuevo ticket:', error);
    }
  }, []);

  // Función para notificar actualización de proyecto
  const notifyProjectUpdate = useCallback(async (projectId, clientId, updateType, projectTitle) => {
    try {
      await notificationService.notifyProjectUpdate(projectId, clientId, updateType, projectTitle);
    } catch (error) {
      console.error('Error al notificar actualización de proyecto:', error);
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    stats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    createNotification,
    notifyNewBudget,
    notifyBudgetUpdate,
    notifyNewTicket,
    notifyProjectUpdate,
    loadNotifications,
    loadStats
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 