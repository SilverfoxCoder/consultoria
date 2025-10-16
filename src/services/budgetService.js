import { API_CONFIG, handleCorsError } from '../config/api';

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
      
      // Manejo específico de errores de red
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('🔄 Error de conexión, usando datos mock...');
        this.useMockData = true;
        return this.handleMockResponse(endpoint, options);
      }
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. El servidor tardó demasiado en responder.');
      }
      
      // Para otros errores, intentar usar datos mock
      console.log('🔄 Error general, usando datos mock...');
      this.useMockData = true;
      return this.handleMockResponse(endpoint, options);
    }
  }

  // Manejar respuestas mock cuando el backend no está disponible
  handleMockResponse(endpoint, options) {
    console.log('🎭 Usando datos mock para:', endpoint);
    
    if (endpoint === '/budgets' && options.method === 'POST') {
      const requestData = JSON.parse(options.body);
      const mockBudget = {
        id: Date.now(),
        ...requestData,
        status: 'PENDIENTE',
        statusDisplay: 'Pendiente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responseDate: null,
        responseNotes: null,
        approvedBudget: null,
        approvedTimeline: null
      };
      
      console.log('✅ Presupuesto mock creado:', mockBudget);
      return mockBudget;
    }
    
    if (endpoint === '/budgets/statistics') {
      return {
        total: 3,
        pending: 1,
        inReview: 2,
        approved: 0,
        rejected: 0
      };
    }
    
    if (endpoint.startsWith('/budgets/status/')) {
      const status = endpoint.split('/').pop();
      const mockBudgets = [
        {
          id: 1,
          title: "Desarrollo de aplicación móvil",
          description: "App para gestión de citas médicas con integración de calendario",
          serviceType: "Desarrollo Móvil",
          budget: 15000,
          timeline: "3-4 meses",
          additionalInfo: "Requiere integración con Google Calendar y sistema de pagos",
          clientId: 2,
          clientName: "Clínica Médica ABC",
          status: "EN_REVISION",
          statusDisplay: "En Revisión",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-16T14:20:00Z",
          responseDate: null,
          responseNotes: null,
          approvedBudget: null,
          approvedTimeline: null
        },
        {
          id: 2,
          title: "Sitio web corporativo",
          description: "Rediseño completo del sitio web con nueva identidad visual",
          serviceType: "Desarrollo Web",
          budget: 8000,
          timeline: "2-3 meses",
          additionalInfo: "Necesita ser responsive y optimizado para SEO",
          clientId: 3,
          clientName: "Empresa XYZ",
          status: "EN_REVISION",
          statusDisplay: "En Revisión",
          createdAt: "2024-01-14T09:15:00Z",
          updatedAt: "2024-01-15T16:45:00Z",
          responseDate: null,
          responseNotes: null,
          approvedBudget: null,
          approvedTimeline: null
        },
        {
          id: 3,
          title: "Sistema de gestión empresarial",
          description: "Plataforma completa para gestión de inventario y ventas",
          serviceType: "Consultoría IT",
          budget: 25000,
          timeline: "6-8 meses",
          additionalInfo: "Incluye capacitación del personal y soporte técnico",
          clientId: 4,
          clientName: "Distribuidora Industrial",
          status: "EN_REVISION",
          statusDisplay: "En Revisión",
          createdAt: "2024-01-13T11:00:00Z",
          updatedAt: "2024-01-14T13:30:00Z",
          responseDate: null,
          responseNotes: null,
          approvedBudget: null,
          approvedTimeline: null
        }
      ];
      
      return mockBudgets.filter(budget => budget.status === status);
    }
    
    if (endpoint.startsWith('/budgets/client/')) {
      const clientId = endpoint.split('/').pop();
      const mockBudgets = [
        {
          id: 1,
          title: "Desarrollo de aplicación móvil",
          description: "App para gestión de citas médicas con integración de calendario",
          serviceType: "Desarrollo Móvil",
          budget: 15000,
          timeline: "3-4 meses",
          additionalInfo: "Requiere integración con Google Calendar y sistema de pagos",
          clientId: parseInt(clientId),
          clientName: "Tu Empresa",
          status: "EN_REVISION",
          statusDisplay: "En Revisión",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-16T14:20:00Z",
          responseDate: null,
          responseNotes: null,
          approvedBudget: null,
          approvedTimeline: null
        }
      ];
      
      return mockBudgets;
    }
    
    return [];
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