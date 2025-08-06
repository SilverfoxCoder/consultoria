import { API_CONFIG, handleCorsError } from '../config/api';

class SupportService {
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

  // Obtener todos los tickets
  async getAllTickets() {
    try {
      return await this.request('/support-tickets');
    } catch (error) {
      console.warn('Support tickets endpoint not available, using mock data');
      return this.getMockTickets();
    }
  }

  // Obtener ticket por ID
  async getTicketById(id) {
    return this.request(`/support-tickets/${id}`);
  }

  // Obtener tickets por estado
  async getTicketsByStatus(status) {
    return this.request(`/support-tickets/status/${status}`);
  }

  // Obtener tickets por prioridad
  async getTicketsByPriority(priority) {
    return this.request(`/support-tickets/priority/${priority}`);
  }

  // Obtener tickets por cliente
  async getTicketsByClient(clientId) {
    return this.request(`/support-tickets/client/${clientId}`);
  }

  // Crear nuevo ticket
  async createTicket(ticketData) {
    return this.request('/support-tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  }

  // Actualizar ticket
  async updateTicket(id, ticketData) {
    return this.request(`/support-tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData)
    });
  }

  // Eliminar ticket
  async deleteTicket(id) {
    return this.request(`/support-tickets/${id}`, {
      method: 'DELETE'
    });
  }

  // Obtener estadísticas de tickets
  async getTicketStats() {
    try {
      const tickets = await this.getAllTickets();
      
      return {
        total: tickets.length,
        abiertos: tickets.filter(t => t.status === 'open').length,
        enProgreso: tickets.filter(t => t.status === 'in-progress').length,
        cerrados: tickets.filter(t => t.status === 'closed').length,
        alta: tickets.filter(t => t.priority === 'high').length,
        media: tickets.filter(t => t.priority === 'medium').length,
        baja: tickets.filter(t => t.priority === 'low').length
      };
    } catch (error) {
      console.warn('Using mock ticket stats');
      return this.getMockTicketStats();
    }
  }

  // Datos mock para cuando el backend no está disponible
  getMockTickets() {
    return [
      {
        id: 1,
        title: 'Problema con el sistema de facturación',
        description: 'No se pueden generar facturas automáticamente',
        status: 'open',
        priority: 'high',
        clientId: 1,
        createdAt: '2024-12-01T10:00:00Z'
      },
      {
        id: 2,
        title: 'Solicitud de nueva funcionalidad',
        description: 'Necesitamos un módulo de reportes avanzados',
        status: 'in-progress',
        priority: 'medium',
        clientId: 1,
        createdAt: '2024-12-02T14:30:00Z'
      },
      {
        id: 3,
        title: 'Error en el dashboard',
        description: 'Los gráficos no se muestran correctamente',
        status: 'open',
        priority: 'low',
        clientId: 2,
        createdAt: '2024-12-03T09:15:00Z'
      }
    ];
  }

  getMockTicketStats() {
    return {
      total: 3,
      abiertos: 2,
      enProgreso: 1,
      cerrados: 0,
      alta: 1,
      media: 1,
      baja: 1
    };
  }
}

export const supportService = new SupportService(); 