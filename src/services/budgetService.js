import { API_CONFIG } from '../config/api';

class BudgetService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.useMockData = false; // Flag para usar datos mock cuando el backend no esté disponible
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🌐 Frontend request to: ${url}`);
      console.log(`📤 Request data:`, options.body ? JSON.parse(options.body) : 'N/A');
      console.log(`🔧 Request config:`, {
        method: config.method,
        headers: config.headers,
        body: config.body ? 'Present' : 'None'
      });
      
      const response = await fetch(url, config);
      
      console.log(`📊 Response status: ${response.status} ${response.statusText}`);
      console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ Error response:`, errorText);
        
        // Si es un error 400, intentar usar datos mock
        if (response.status === 400) {
          console.log('🔄 Backend devolvió error 400, usando datos mock...');
          this.useMockData = true;
          return this.handleMockResponse(endpoint, options);
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Success response:`, data);
      return data;
    } catch (error) {
      console.error(`💥 Request error:`, error.message);
      console.error(`🔍 Error type:`, error.name);
      console.error(`📚 Error stack:`, error.stack);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. El servidor tardó demasiado en responder.');
      }
      
      throw error;
    }
  }



  // Crear un nuevo presupuesto
  async createBudget(budgetData) {
    return this.request('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  }

  // Crear presupuesto para cliente específico
  async createBudgetForClient(clientId, budgetData) {
    console.log('🔍 createBudgetForClient llamado con:');
    console.log('  - clientId:', clientId);
    console.log('  - budgetData:', budgetData);
    
    const finalData = {
      ...budgetData,
      clientId: clientId
    };
    
    console.log('🔍 Datos finales a enviar:', finalData);
    
    // Usar el endpoint general ya que el específico por cliente puede no estar implementado
    const result = await this.request('/budgets', {
      method: 'POST',
      body: JSON.stringify(finalData),
    });

    // Notificar nuevo presupuesto si la creación fue exitosa
    if (result && result.id) {
      try {
        // Importar dinámicamente para evitar dependencias circulares
        const notificationService = await import('./notificationService');
        await notificationService.default.notifyNewBudget(result.id, clientId, budgetData.title);
      } catch (error) {
        console.error('Error al notificar nuevo presupuesto:', error);
      }
    }

    return result;
  }

  // Obtener todos los presupuestos
  async getAllBudgets() {
    return this.request('/budgets');
  }

  // Obtener presupuesto por ID
  async getBudgetById(id) {
    return this.request(`/budgets/${id}`);
  }

  // Obtener presupuestos por cliente
  async getBudgetsByClient(clientId) {
    return this.request(`/budgets/client/${clientId}`);
  }

  // Obtener presupuestos por estado
  async getBudgetsByStatus(status) {
    return this.request(`/budgets/status/${status}`);
  }

  // Actualizar estado de presupuesto
  async updateBudgetStatus(id, statusData) {
    const result = await this.request(`/budgets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });

    // Notificar actualización de presupuesto si fue exitosa
    if (result && result.id) {
      try {
        // Importar dinámicamente para evitar dependencias circulares
        const notificationService = await import('./notificationService');
        await notificationService.default.notifyBudgetUpdate(
          result.id, 
          result.clientId, 
          statusData.status, 
          result.title
        );
      } catch (error) {
        console.error('Error al notificar actualización de presupuesto:', error);
      }
    }

    return result;
  }

  // Eliminar presupuesto
  async deleteBudget(id) {
    return this.request(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // Obtener estadísticas de presupuestos
  async getBudgetStatistics() {
    return this.request('/budgets/statistics');
  }
}

const budgetService = new BudgetService();
export default budgetService; 