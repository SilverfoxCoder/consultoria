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
      console.warn('Analytics endpoint not available, using mock data');
      return this.getMockAnalytics();
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
      console.warn('Using mock KPIs data');
      return this.getMockKPIs();
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
      console.warn('Using mock monthly data');
      return this.getMockMonthlyData();
    }
  }

  // Datos mock para cuando el backend no está disponible
  getMockAnalytics() {
    return {
      monthlyRevenue: 25000,
      monthlyData: [
        { month: 'Ene', revenue: 20000, projects: 3, clients: 2 },
        { month: 'Feb', revenue: 22000, projects: 4, clients: 3 },
        { month: 'Mar', revenue: 25000, projects: 5, clients: 4 },
        { month: 'Abr', revenue: 28000, projects: 6, clients: 5 },
        { month: 'May', revenue: 30000, projects: 7, clients: 6 },
        { month: 'Jun', revenue: 32000, projects: 8, clients: 7 },
        { month: 'Jul', revenue: 35000, projects: 9, clients: 8 },
        { month: 'Ago', revenue: 38000, projects: 10, clients: 9 },
        { month: 'Sep', revenue: 40000, projects: 11, clients: 10 },
        { month: 'Oct', revenue: 42000, projects: 12, clients: 11 },
        { month: 'Nov', revenue: 45000, projects: 13, clients: 12 },
        { month: 'Dic', revenue: 48000, projects: 14, clients: 13 }
      ]
    };
  }

  getMockKPIs() {
    return {
      totalSpent: 25000,
      activeProjects: 5,
      openTickets: 3,
      avgResponseTime: 2.5
    };
  }

  getMockMonthlyData() {
    return [
      { month: 'Ene', spent: 20000, projects: 3, tickets: 2 },
      { month: 'Feb', spent: 22000, projects: 4, tickets: 3 },
      { month: 'Mar', spent: 25000, projects: 5, tickets: 4 },
      { month: 'Abr', spent: 28000, projects: 6, tickets: 5 },
      { month: 'May', spent: 30000, projects: 7, tickets: 6 },
      { month: 'Jun', spent: 32000, projects: 8, tickets: 7 },
      { month: 'Jul', spent: 35000, projects: 9, tickets: 8 },
      { month: 'Ago', spent: 38000, projects: 10, tickets: 9 },
      { month: 'Sep', spent: 40000, projects: 11, tickets: 10 },
      { month: 'Oct', spent: 42000, projects: 12, tickets: 11 },
      { month: 'Nov', spent: 45000, projects: 13, tickets: 12 },
      { month: 'Dic', spent: 48000, projects: 14, tickets: 13 }
    ];
  }
}

export const analyticsService = new AnalyticsService(); 