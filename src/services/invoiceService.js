import { API_CONFIG, handleCorsError } from '../config/api';

class InvoiceService {
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

  // Obtener todas las facturas
  async getAllInvoices() {
    return await this.request('/invoices');
  }

  // Obtener facturas por cliente
  async getInvoicesByClient(clientId) {
    try {
      return await this.request(`/invoices/client/${clientId}`);
    } catch (error) {
      console.warn('Error fetching invoices, returning empty list:', error);
      return [];
    }
  }

  // Obtener factura por ID
  async getInvoiceById(id) {
    return await this.request(`/invoices/${id}`);
  }

  // Descargar factura (simulado por ahora, devuelve URL o blob)
  async downloadInvoice(id) {
    // Implementación real dependería de cómo el backend entrega los archivos
    // Por ahora asumimos que devuelve un objeto con la URL
    return await this.request(`/invoices/${id}/download`);
  }
}

export const invoiceService = new InvoiceService();
