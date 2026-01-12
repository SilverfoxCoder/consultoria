import { API_CONFIG } from '../config/api';

/**
 * Servicio para gestión de administradores
 * Integra las nuevas APIs de notificaciones para administradores implementadas en el backend
 */
class AdminService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.headers = API_CONFIG.HEADERS;
  }

  /**
   * Método auxiliar para realizar peticiones con manejo de errores
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('xperiecia_token');
    
    try {
      console.log('🔍 AdminService: Realizando petición');
      console.log('  URL:', url);
      console.log('  Método:', options.method || 'GET');

      const response = await fetch(url, {
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      });

      console.log('📥 AdminService: Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ AdminService: Error en respuesta:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ AdminService: Datos parseados exitosamente');
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🌐 AdminService: Error de red - no se pudo conectar al servidor');
        throw new Error('No se pudo conectar al servidor. Verifica tu conexión.');
      } else if (error.name === 'AbortError') {
        console.error('⏱️ AdminService: Timeout - la petición tardó demasiado');
        throw new Error('La petición tardó demasiado tiempo. Intenta nuevamente.');
      }
      
      console.error('❌ AdminService: Error:', error);
      throw error;
    }
  }

  // ==================== NOTIFICACIONES DE ADMINISTRADORES ====================

  /**
   * Obtener notificaciones de administradores con paginación
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Número de página (default: 0)
   * @param {number} params.size - Tamaño de página (default: 20)
   * @param {string} params.sortBy - Campo de ordenación (default: createdAt)
   * @param {string} params.sortDir - Dirección de ordenación (default: desc)
   */
  async getAdminNotifications(params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'createdAt',
      sortDir = 'desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    return this.request(`/admin/notifications?${queryParams}`);
  }

  /**
   * Marcar una notificación de administrador como leída
   * @param {number} notificationId - ID de la notificación
   */
  async markAdminNotificationAsRead(notificationId) {
    return this.request(`/admin/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
  }

  /**
   * Marcar todas las notificaciones de administrador como leídas
   */
  async markAllAdminNotificationsAsRead() {
    return this.request('/admin/notifications/read-all', {
      method: 'PUT'
    });
  }

  /**
   * Eliminar una notificación de administrador
   * @param {number} notificationId - ID de la notificación
   */
  async deleteAdminNotification(notificationId) {
    return this.request(`/admin/notifications/${notificationId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Eliminar todas las notificaciones de administrador
   */
  async deleteAllAdminNotifications() {
    return this.request('/admin/notifications', {
      method: 'DELETE'
    });
  }

  /**
   * Obtener resumen de estadísticas del sistema
   */
  async getSystemStats() {
    return this.request('/admin/stats/summary');
  }

  // ==================== ENVÍO MANUAL DE ESTADÍSTICAS ====================

  /**
   * Enviar estadísticas diarias manualmente
   */
  async sendDailyStats() {
    return this.request('/admin/notifications/daily-stats', {
      method: 'POST'
    });
  }

  /**
   * Enviar estadísticas semanales manualmente
   */
  async sendWeeklyStats() {
    return this.request('/admin/notifications/weekly-stats', {
      method: 'POST'
    });
  }

  /**
   * Enviar estadísticas mensuales manualmente
   */
  async sendMonthlyStats() {
    return this.request('/admin/notifications/monthly-stats', {
      method: 'POST'
    });
  }

  // ==================== ENDPOINTS DE PRUEBA ====================

  /**
   * Simular notificación de nuevo registro de usuario
   * @param {number} userId - ID del usuario
   */
  async testUserRegistration(userId) {
    return this.request(`/admin/notifications/test/user-registration/${userId}`, {
      method: 'POST'
    });
  }

  /**
   * Simular notificación de primer login
   * @param {number} userId - ID del usuario
   */
  async testFirstLogin(userId) {
    return this.request(`/admin/notifications/test/first-login/${userId}`, {
      method: 'POST'
    });
  }

  /**
   * Simular notificación de solicitud de presupuesto
   * @param {Object} params - Parámetros de la solicitud
   * @param {number} params.budgetId - ID del presupuesto
   * @param {string} params.clientName - Nombre del cliente
   * @param {string} params.projectName - Nombre del proyecto
   */
  async testBudgetRequest({ budgetId, clientName, projectName }) {
    const queryParams = new URLSearchParams({
      budgetId: budgetId.toString(),
      clientName,
      projectName
    });

    return this.request(`/admin/notifications/test/budget-request?${queryParams}`, {
      method: 'POST'
    });
  }

  /**
   * Simular notificación de error del sistema
   * @param {Object} params - Parámetros del error
   * @param {string} params.errorType - Tipo de error
   * @param {string} params.errorMessage - Mensaje de error
   */
  async testSystemError({ errorType, errorMessage }) {
    const queryParams = new URLSearchParams({
      errorType,
      errorMessage
    });

    return this.request(`/admin/notifications/test/system-error?${queryParams}`, {
      method: 'POST'
    });
  }

  /**
   * Simular notificación de actividad inusual
   * @param {Object} params - Parámetros de la actividad
   * @param {string} params.activityType - Tipo de actividad
   * @param {number} params.count - Cantidad de eventos
   */
  async testUnusualActivity({ activityType, count }) {
    const queryParams = new URLSearchParams({
      activityType,
      count: count.toString()
    });

    return this.request(`/admin/notifications/test/unusual-activity?${queryParams}`, {
      method: 'POST'
    });
  }

  /**
   * Test de funcionamiento del controlador
   */
  async testController() {
    return this.request('/admin/test');
  }

  // ==================== MÉTODOS DE UTILIDAD ====================

  /**
   * Obtener tipos de notificaciones disponibles
   */
  getNotificationTypes() {
    return {
      USER_REGISTRATION: {
        name: 'Registro de Usuario',
        icon: '👤',
        color: 'blue',
        priority: 'MEDIUM'
      },
      FIRST_LOGIN: {
        name: 'Primer Login',
        icon: '🔐',
        color: 'green',
        priority: 'MEDIUM'
      },
      BUDGET_REQUEST: {
        name: 'Solicitud de Presupuesto',
        icon: '💼',
        color: 'yellow',
        priority: 'MEDIUM'
      },
      DAILY_STATS: {
        name: 'Estadísticas Diarias',
        icon: '📊',
        color: 'purple',
        priority: 'MEDIUM'
      },
      WEEKLY_STATS: {
        name: 'Estadísticas Semanales',
        icon: '📈',
        color: 'purple',
        priority: 'MEDIUM'
      },
      MONTHLY_STATS: {
        name: 'Estadísticas Mensuales',
        icon: '📈',
        color: 'red',
        priority: 'HIGH'
      },
      SYSTEM_ERROR: {
        name: 'Error del Sistema',
        icon: '🚨',
        color: 'red',
        priority: 'HIGH'
      },
      UNUSUAL_ACTIVITY: {
        name: 'Actividad Inusual',
        icon: '⚠️',
        color: 'orange',
        priority: 'LOW'
      }
    };
  }

  /**
   * Obtener prioridades disponibles
   */
  getPriorities() {
    return {
      LOW: {
        name: 'Baja',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-300'
      },
      MEDIUM: {
        name: 'Media',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-300'
      },
      HIGH: {
        name: 'Alta',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-300'
      }
    };
  }

  /**
   * Formatear fecha relativa
   * @param {string} dateString - Fecha en formato ISO
   */
  formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Formatear fecha completa
   * @param {string} dateString - Fecha en formato ISO
   */
  formatFullDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Crear y exportar instancia única
const adminService = new AdminService();

export { adminService };
export default adminService;