import { API_CONFIG, handleCorsError } from '../config/api';

class AnalyticsService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
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

  // Obtener todas las analíticas
  async getAllAnalytics() {
    try {
      return await this.request('/analytics');
    } catch (error) {
      console.warn('Error fetching analytics:', error);
      return [];
    }
  }

  // Obtener analítica por ID
  async getAnalyticsById(id) {
    return this.request(`/analytics/${id}`);
  }

  // Obtener analíticas por mes
  async getAnalyticsByMonth(month) {
    return this.request(`/analytics/month/${month}`);
  }

  // Obtener analíticas por cliente
  async getAnalyticsByClient(clientId) {
    return this.request(`/analytics/client/${clientId}`);
  }

  // Obtener analítica específica por cliente y mes
  async getAnalyticsByClientAndMonth(clientId, month) {
    return this.request(`/analytics/client/${clientId}/month/${month}`);
  }

  // Crear nueva analítica
  async createAnalytics(analyticsData) {
    return this.request('/analytics', {
      method: 'POST',
      body: JSON.stringify(analyticsData)
    });
  }

  // Actualizar analítica
  async updateAnalytics(id, analyticsData) {
    return this.request(`/analytics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(analyticsData)
    });
  }

  // Eliminar analítica
  async deleteAnalytics(id) {
    return this.request(`/analytics/${id}`, {
      method: 'DELETE'
    });
  }

  // Obtener KPIs del dashboard
  async getDashboardKPIs() {
    try {
      const analytics = await this.getAllAnalytics();
      
      // Calcular KPIs basados en los últimos 6 meses
      const last6Months = analytics.slice(-6);
      
      return {
        totalSpent: last6Months.reduce((sum, a) => sum + (a.totalSpent || 0), 0),
        activeProjects: last6Months.reduce((sum, a) => sum + (a.activeProjects || 0), 0),
        openTickets: last6Months.reduce((sum, a) => sum + (a.openTickets || 0), 0),
        avgResponseTime: last6Months.length > 0 ? 
          last6Months.reduce((sum, a) => sum + (a.avgResponseTime?.seconds || 0), 0) / last6Months.length : 0
      };
    } catch (error) {
      console.warn('Error fetching KPIs:', error);
      return {
        totalSpent: 0,
        activeProjects: 0,
        openTickets: 0,
        avgResponseTime: 0
      };
    }
  }

  // Obtener datos mensuales para gráficos
  async getMonthlyData() {
    try {
      const analytics = await this.getAllAnalytics();
      
      // Ordenar por mes y tomar los últimos 12 meses
      const sortedAnalytics = analytics
        .sort((a, b) => new Date(a.month) - new Date(b.month))
        .slice(-12);
      
      return sortedAnalytics.map(a => ({
        month: a.month,
        spent: a.totalSpent || 0,
        projects: a.activeProjects || 0,
        tickets: a.openTickets || 0
      }));
    } catch (error) {
      console.warn('Error fetching monthly data:', error);
      return [];
    }
  }
  // Obtener datos del dashboard en tiempo real
  async getDashboardAnalytics(clientId) {
    return this.request(`/analytics/dashboard/${clientId}`);
  }
}

export const analyticsService = new AnalyticsService(); 