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
    return await this.request('/support-tickets');
  }

  // Obtener estadísticas de tickets
  async getTicketStats() {
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


}

export const supportService = new SupportService(); 