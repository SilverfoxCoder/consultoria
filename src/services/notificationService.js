import { API_CONFIG } from '../config/api';

// Función para verificar si OpenAPI Service está disponible
const getOpenAPIService = () => {
  try {
    // Intentar importar el servicio OpenAPI si está disponible
    const { getOpenAPIService } = require('./openapiService.js');
    return getOpenAPIService();
  } catch (error) {
    // Si no está disponible, retornar null
    return null;
  }
};

class NotificationService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  // Tipos de notificaciones
  static NOTIFICATION_TYPES = {
    BUDGET_PENDING: 'BUDGET_PENDING',
    BUDGET_APPROVED: 'BUDGET_APPROVED',
    BUDGET_REJECTED: 'BUDGET_REJECTED',
    TICKET_NEW: 'TICKET_NEW',
    TICKET_UPDATED: 'TICKET_UPDATED',
    TICKET_RESOLVED: 'TICKET_RESOLVED',
    PROJECT_UPDATE: 'PROJECT_UPDATE',
    PROJECT_MILESTONE: 'PROJECT_MILESTONE',
    PROJECT_COMPLETED: 'PROJECT_COMPLETED',
    SYSTEM_ANNOUNCEMENT: 'SYSTEM_ANNOUNCEMENT',
    TASK_ASSIGNED: 'TASK_ASSIGNED',
    TASK_COMPLETED: 'TASK_COMPLETED'
  };

  // Prioridades de notificaciones
  static PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  };

  // Inicializar WebSocket
  initializeWebSocket(userId) {
    if (this.ws) {
      this.ws.close();
    }

    try {
      this.ws = new WebSocket(`ws://localhost:8080/ws/notifications`);
      
      this.ws.onopen = () => {
        console.log('🔔 WebSocket conectado para notificaciones');
        this.reconnectAttempts = 0;
        
        // Suscribirse al topic de notificaciones de admin
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            destination: '/topic/notifications/admin',
            type: 'SUBSCRIBE'
          }));
          console.log('🔔 WebSocket: Suscrito al topic de notificaciones de admin');
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          this.handleIncomingNotification(notification);
        } catch (error) {
          console.error('Error al procesar notificación:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('🔔 WebSocket desconectado');
        this.attemptReconnect(userId);
      };

      this.ws.onerror = (error) => {
        console.error('🔔 Error en WebSocket:', error);
      };

    } catch (error) {
      console.error('Error al inicializar WebSocket:', error);
    }
  }

  // Intentar reconectar
  attemptReconnect(userId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔔 Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.initializeWebSocket(userId);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('🔔 Máximo de intentos de reconexión alcanzado');
    }
  }

  // Manejar notificación entrante
  handleIncomingNotification(notification) {
    // Emitir evento personalizado para que los componentes puedan escuchar
    const event = new CustomEvent('newNotification', { 
      detail: notification 
    });
    window.dispatchEvent(event);
  }

  // Obtener notificaciones del usuario
  async getUserNotifications(userId, page = 0, size = 20) {
    try {
      const url = `${API_CONFIG.BASE_URL}/notifications/user/${userId}?page=${page}&size=${size}`;
      const token = localStorage.getItem('xperiecia_token');
      
      console.log('🔍 NotificationService: Obteniendo notificaciones');
      console.log('  URL:', url);
      console.log('  Token disponible:', !!token);
      console.log('  UserId:', userId);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      console.log('🔍 NotificationService: Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta:', errorText);
        return { content: [], totalElements: 0, totalPages: 0 };
      }

      const data = await response.json();
      console.log('✅ NotificationService: Datos parseados:', data);
      return data;
    } catch (error) {
      console.error('❌ NotificationService: Error al obtener notificaciones:', error);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  }

  // Marcar notificación como leída
  async markAsRead(notificationId) {
    try {
      const token = localStorage.getItem('xperiecia_token');
      
      console.log('🔄 NotificationService: Marcando notificación como leída:', notificationId);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      console.log('📥 NotificationService: Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ NotificationService: Notificación marcada como leída:', data);
      return data;
    } catch (error) {
      console.error('❌ NotificationService: Error al marcar notificación como leída:', error);
      throw error;
    }
  }

  // Marcar todas las notificaciones como leídas
  async markAllAsRead(userId) {
    try {
      const token = localStorage.getItem('xperiecia_token');
      
      console.log('🔄 NotificationService: Marcando todas las notificaciones como leídas para usuario:', userId);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/user/${userId}/read-all`, {
        method: 'PUT',
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      console.log('📥 NotificationService: Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ NotificationService: Todas las notificaciones marcadas como leídas:', data);
      return data;
    } catch (error) {
      console.error('❌ NotificationService: Error al marcar todas las notificaciones como leídas:', error);
      throw error;
    }
  }

  // Eliminar notificación
  async deleteNotification(notificationId) {
    try {
      const token = localStorage.getItem('xperiecia_token');
      
      console.log('🗑️ NotificationService: Eliminando notificación:', notificationId);
      console.log('  Token disponible:', !!token);

      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      console.log('📥 NotificationService: Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      console.log('✅ NotificationService: Notificación eliminada');
      return true;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw error;
    }
  }

  // Obtener estadísticas de notificaciones
  async getNotificationStats(userId) {
    try {
      const token = localStorage.getItem('xperiecia_token');
      
      console.log('📊 NotificationService: Obteniendo estadísticas para usuario:', userId);
      console.log('  Token disponible:', !!token);

      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/user/${userId}/stats`, {
        method: 'GET',
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      console.log('📥 NotificationService: Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ NotificationService: Estadísticas obtenidas:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener estadísticas de notificaciones:', error);
      return {
        total: 0,
        unread: 0,
        byType: {},
        byPriority: {}
      };
    }
  }

  // Crear notificación
  async createNotification(notificationData) {
    try {
      console.log('🔄 NotificationService: Creando notificación:', notificationData);

      // Transformar datos al formato esperado por el backend según OpenAPI
      const backendNotificationData = {
        userId: notificationData.targetUserId != null && notificationData.targetUserId !== ''
          ? (isNaN(notificationData.targetUserId) ? notificationData.targetUserId : parseInt(notificationData.targetUserId))
          : undefined,
        targetRole: notificationData.targetRole || undefined,
        title: String(notificationData.title || ''),
        message: String(notificationData.message || ''),
        type: String(notificationData.type || 'info'),
        priority: notificationData.priority || undefined,
        relatedEntityId: notificationData.relatedEntityId || undefined,
        relatedEntityType: notificationData.relatedEntityType || undefined,
        metadata: notificationData.metadata || undefined,
        isRead: false
      };

      // Validar que todos los campos requeridos están presentes
      if (!backendNotificationData.userId && !backendNotificationData.targetRole) {
        throw new Error('userId o targetRole es requerido para crear la notificación');
      }
      if (!backendNotificationData.title) {
        throw new Error('title es requerido para crear la notificación');
      }
      if (!backendNotificationData.message) {
        throw new Error('message es requerido para crear la notificación');
      }

      console.log('🔄 NotificationService: Datos transformados para backend:', backendNotificationData);

      // Intentar usar OpenAPI Service si está disponible
      const openApiService = getOpenAPIService();
      if (openApiService && openApiService.isLoaded) {
        console.log('🚀 NotificationService: Usando OpenAPI Service');
        try {
          return await openApiService.createNotification(backendNotificationData);
        } catch (error) {
          console.warn('⚠️ NotificationService: OpenAPI falló, usando método tradicional:', error.message);
        }
      }

      // Método tradicional como fallback
      const token = localStorage.getItem('xperiecia_token');
      console.log('🔄 NotificationService: Usando método tradicional, token disponible:', !!token);

      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/create`, {
        method: 'POST',
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backendNotificationData),
        credentials: 'include'
      });

      console.log('📥 NotificationService: Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ NotificationService: Notificación creada:', data);
      return data;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw error;
    }
  }

  // Notificar nuevo presupuesto
  async notifyNewBudget(budgetId, clientId, budgetTitle) {
    try {
      const notificationData = {
        type: NotificationService.NOTIFICATION_TYPES.BUDGET_PENDING,
        title: 'Nuevo Presupuesto Pendiente',
        message: `Nuevo presupuesto "${budgetTitle}" requiere aprobación`,
        priority: NotificationService.PRIORITIES.HIGH,
        targetUserId: null, // Para administradores
        targetRole: 'admin',
        relatedEntityId: budgetId,
        relatedEntityType: 'budget',
        metadata: {
          budgetId,
          clientId,
          budgetTitle
        }
      };

      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Error al notificar nuevo presupuesto:', error);
      throw error;
    }
  }

  // Notificar actualización de presupuesto
  async notifyBudgetUpdate(budgetId, clientId, status, budgetTitle) {
    try {
      let type, title, message;
      
      switch (status) {
        case 'APROBADO':
          type = NotificationService.NOTIFICATION_TYPES.BUDGET_APPROVED;
          title = 'Presupuesto Aprobado';
          message = `Tu presupuesto "${budgetTitle}" ha sido aprobado`;
          break;
        case 'RECHAZADO':
          type = NotificationService.NOTIFICATION_TYPES.BUDGET_REJECTED;
          title = 'Presupuesto Rechazado';
          message = `Tu presupuesto "${budgetTitle}" ha sido rechazado`;
          break;
        default:
          type = NotificationService.NOTIFICATION_TYPES.BUDGET_PENDING;
          title = 'Presupuesto Actualizado';
          message = `Tu presupuesto "${budgetTitle}" ha sido actualizado`;
      }

      const notificationData = {
        type,
        title,
        message,
        priority: NotificationService.PRIORITIES.MEDIUM,
        targetUserId: clientId,
        targetRole: 'client',
        relatedEntityId: budgetId,
        relatedEntityType: 'budget',
        metadata: {
          budgetId,
          status,
          budgetTitle
        }
      };

      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Error al notificar actualización de presupuesto:', error);
      throw error;
    }
  }

  // Notificar nuevo ticket
  async notifyNewTicket(ticketId, clientId, ticketTitle) {
    try {
      const notificationData = {
        type: NotificationService.NOTIFICATION_TYPES.TICKET_NEW,
        title: 'Nuevo Ticket Abierto',
        message: `Nuevo ticket "${ticketTitle}" requiere atención`,
        priority: NotificationService.PRIORITIES.HIGH,
        targetUserId: null,
        targetRole: 'admin',
        relatedEntityId: ticketId,
        relatedEntityType: 'ticket',
        metadata: {
          ticketId,
          clientId,
          ticketTitle
        }
      };

      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Error al notificar nuevo ticket:', error);
      throw error;
    }
  }

  // Notificar actualización de proyecto
  async notifyProjectUpdate(projectId, clientId, updateType, projectTitle) {
    try {
      let type, title, message;
      
      switch (updateType) {
        case 'milestone':
          type = NotificationService.NOTIFICATION_TYPES.PROJECT_MILESTONE;
          title = 'Hito del Proyecto Completado';
          message = `Se ha completado un hito en el proyecto "${projectTitle}"`;
          break;
        case 'completed':
          type = NotificationService.NOTIFICATION_TYPES.PROJECT_COMPLETED;
          title = 'Proyecto Completado';
          message = `El proyecto "${projectTitle}" ha sido completado`;
          break;
        default:
          type = NotificationService.NOTIFICATION_TYPES.PROJECT_UPDATE;
          title = 'Actualización del Proyecto';
          message = `El proyecto "${projectTitle}" ha sido actualizado`;
      }

      const notificationData = {
        type,
        title,
        message,
        priority: NotificationService.PRIORITIES.MEDIUM,
        targetUserId: clientId,
        targetRole: 'client',
        relatedEntityId: projectId,
        relatedEntityType: 'project',
        metadata: {
          projectId,
          updateType,
          projectTitle
        }
      };

      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Error al notificar actualización de proyecto:', error);
      throw error;
    }
  }

  // Cerrar WebSocket
  closeWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Obtener icono según tipo de notificación
  static getNotificationIcon(type) {
    switch (type) {
      case NotificationService.NOTIFICATION_TYPES.BUDGET_PENDING:
      case NotificationService.NOTIFICATION_TYPES.BUDGET_APPROVED:
      case NotificationService.NOTIFICATION_TYPES.BUDGET_REJECTED:
        return '💰';
      case NotificationService.NOTIFICATION_TYPES.TICKET_NEW:
      case NotificationService.NOTIFICATION_TYPES.TICKET_UPDATED:
      case NotificationService.NOTIFICATION_TYPES.TICKET_RESOLVED:
        return '🎫';
      case NotificationService.NOTIFICATION_TYPES.PROJECT_UPDATE:
      case NotificationService.NOTIFICATION_TYPES.PROJECT_MILESTONE:
      case NotificationService.NOTIFICATION_TYPES.PROJECT_COMPLETED:
        return '📁';
      case NotificationService.NOTIFICATION_TYPES.TASK_ASSIGNED:
      case NotificationService.NOTIFICATION_TYPES.TASK_COMPLETED:
        return '✅';
      case NotificationService.NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT:
        return '📢';
      default:
        return '🔔';
    }
  }

  // Obtener color según prioridad
  static getPriorityColor(priority) {
    switch (priority) {
      case NotificationService.PRIORITIES.URGENT:
        return 'text-red-500 bg-red-100';
      case NotificationService.PRIORITIES.HIGH:
        return 'text-orange-500 bg-orange-100';
      case NotificationService.PRIORITIES.MEDIUM:
        return 'text-blue-500 bg-blue-100';
      case NotificationService.PRIORITIES.LOW:
        return 'text-gray-500 bg-gray-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  }
}

const notificationService = new NotificationService();
export default notificationService; 