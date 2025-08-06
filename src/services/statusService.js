import { API_CONFIG, handleCorsError } from '../config/api';

class StatusService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.pollingInterval = null;
    this.subscribers = new Set();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: API_CONFIG.HEADERS,
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      const errorMessage = handleCorsError(error);
      throw new Error(errorMessage);
    }
  }

  // Obtener estado del sistema
  async getSystemStatus() {
    return this.request('/status/system');
  }

  // Obtener estado de conectividad
  async getConnectionStatus() {
    return this.request('/status/connection');
  }

  // Obtener estado de servicios
  async getServicesStatus() {
    return this.request('/status/services');
  }

  // Obtener estado de la base de datos
  async getDatabaseStatus() {
    return this.request('/status/database');
  }

  // Obtener métricas del sistema
  async getSystemMetrics() {
    return this.request('/status/metrics');
  }

  // Obtener estado de proyectos en tiempo real
  async getProjectsStatus() {
    return this.request('/status/projects');
  }

  // Obtener notificaciones
  async getNotifications() {
    return this.request('/status/notifications');
  }

  // Iniciar polling de estado
  startPolling(callback, interval = 5000) {
    this.stopPolling(); // Detener polling anterior si existe
    
    this.pollingInterval = setInterval(async () => {
      try {
        const status = await this.getSystemStatus();
        callback(status);
      } catch (error) {
        console.error('Error polling status:', error);
        callback({ error: error.message });
      }
    }, interval);
  }

  // Detener polling
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Suscribirse a actualizaciones de estado
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Notificar a todos los suscriptores
  notifySubscribers(data) {
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in status subscriber:', error);
      }
    });
  }

  // Obtener estado completo del sistema
  async getFullStatus() {
    try {
      const [systemStatus, connectionStatus, servicesStatus, databaseStatus] = await Promise.all([
        this.getSystemStatus(),
        this.getConnectionStatus(),
        this.getServicesStatus(),
        this.getDatabaseStatus()
      ]);

      return {
        system: systemStatus,
        connection: connectionStatus,
        services: servicesStatus,
        database: databaseStatus,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Error obteniendo estado completo: ${error.message}`);
    }
  }

  // Verificar si el backend está disponible
  async checkBackendHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: API_CONFIG.HEADERS
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Obtener logs del sistema
  async getSystemLogs(limit = 100) {
    return this.request(`/status/logs?limit=${limit}`);
  }

  // Obtener alertas del sistema
  async getSystemAlerts() {
    return this.request('/status/alerts');
  }
}

export const statusService = new StatusService(); 