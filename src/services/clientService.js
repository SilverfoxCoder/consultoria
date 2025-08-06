import { API_CONFIG, handleCorsError } from '../config/api';

class ClientService {
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

  // Obtener todos los clientes
  async getAllClients() {
    return this.request('/clients');
  }

  // Obtener cliente por ID
  async getClientById(id) {
    return this.request(`/clients/${id}`);
  }

  // Crear cliente
  async createClient(clientData) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(this.sanitizeClientData(clientData))
    });
  }

  // Actualizar cliente
  async updateClient(id, clientData) {
    return this.request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(this.sanitizeClientData(clientData))
    });
  }

  // Eliminar cliente
  async deleteClient(id) {
    return this.request(`/clients/${id}`, {
      method: 'DELETE'
    });
  }

  // Obtener clientes por estado
  async getClientsByStatus(status) {
    return this.request(`/clients/status/${status}`);
  }

  // Obtener clientes activos
  async getActiveClients() {
    return this.request('/clients/active');
  }

  // Buscar clientes por nombre
  async searchClientsByName(name) {
    return this.request(`/clients/search?name=${encodeURIComponent(name)}`);
  }

  // Obtener estadísticas de clientes
  async getClientStats() {
    return this.request('/clients/stats');
  }

  // Obtener clientes con proyectos activos
  async getClientsWithActiveProjects() {
    return this.request('/clients/with-active-projects');
  }

  // Obtener clientes por industria
  async getClientsByIndustry(industry) {
    return this.request(`/clients/industry/${encodeURIComponent(industry)}`);
  }

  // Sanitizar datos del cliente para enviar al backend
  sanitizeClientData(data) {
    return {
      name: data.name?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim() || '',
      company: data.company?.trim() || '',
      industry: data.industry?.trim() || '',
      status: data.status || 'ACTIVO',
      address: data.address?.trim() || '',
      city: data.city?.trim() || '',
      country: data.country?.trim() || '',
      notes: data.notes?.trim() || '',
      totalRevenue: parseFloat(data.totalRevenue) || 0,
      totalProjects: parseInt(data.totalProjects) || 0
    };
  }
}

export const clientService = new ClientService(); 