// OpenAPI Service Integration
// Servicio que integra el cliente OpenAPI con los servicios existentes

import { createDefaultClient, loadOpenAPISpec } from '../utils/openapiClient.js';
import { api } from '../config/api.js';

class OpenAPIService {
  constructor() {
    this.client = null;
    this.isLoaded = false;
    this.endpoints = new Map();
    this.schemas = new Map();
  }

  // Inicializar el servicio OpenAPI
  async initialize() {
    try {
      console.log('🚀 Inicializando OpenAPI Service...');
      
      // Intentar cargar la especificación desde el archivo
      try {
        this.client = await loadOpenAPISpec();
        console.log('✅ OpenAPI Service: Especificación cargada desde archivo');
      } catch (error) {
        console.log('⚠️ OpenAPI Service: Usando cliente por defecto');
        this.client = createDefaultClient();
      }
      
      this.isLoaded = true;
      this.setupEndpoints();
      
      console.log('✅ OpenAPI Service inicializado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error inicializando OpenAPI Service:', error);
      return false;
    }
  }

  // Configurar endpoints disponibles
  setupEndpoints() {
    if (!this.client) return;

    const methods = this.client.getMethods();
    
    // Mapear métodos a endpoints
    Object.entries(methods).forEach(([methodName, method]) => {
      this.endpoints.set(methodName, method);
    });

    console.log(`📋 OpenAPI Service: ${this.endpoints.size} endpoints configurados`);
  }

  // Obtener información del servicio
  getServiceInfo() {
    if (!this.client) {
      return {
        loaded: false,
        message: 'Servicio no inicializado'
      };
    }

    return {
      loaded: this.isLoaded,
      info: this.client.getSpecInfo(),
      endpoints: Array.from(this.endpoints.keys()),
      totalEndpoints: this.endpoints.size
    };
  }

  // Ejecutar método del cliente OpenAPI
  async executeMethod(methodName, params = {}, data = null) {
    if (!this.isLoaded || !this.client) {
      throw new Error('OpenAPI Service no está inicializado');
    }

    const method = this.endpoints.get(methodName);
    if (!method) {
      throw new Error(`Método no encontrado: ${methodName}`);
    }

    try {
      console.log(`🔧 OpenAPI Service: Ejecutando ${methodName}`, { params, data });
      const result = await method(params, data);
      console.log(`✅ OpenAPI Service: ${methodName} ejecutado exitosamente`);
      return result;
    } catch (error) {
      console.error(`❌ OpenAPI Service Error en ${methodName}:`, error);
      throw error;
    }
  }

  // Métodos de autenticación
  async login(credentials) {
    return this.executeMethod('login', {}, credentials);
  }

  async googleAuth(googleData) {
    return this.executeMethod('googleAuth', {}, googleData);
  }

  async googleRegister(googleData) {
    return this.executeMethod('googleRegister', {}, googleData);
  }

  // Métodos de usuarios
  async getAllUsers() {
    return this.executeMethod('getAllUsers');
  }

  async getUserById(id) {
    return this.executeMethod('getUserById', { id });
  }

  async createUser(userData) {
    return this.executeMethod('createUser', {}, userData);
  }

  async updateUser(id, userData) {
    return this.executeMethod('updateUser', { id }, userData);
  }

  async deleteUser(id) {
    return this.executeMethod('deleteUser', { id });
  }

  async updateUserStatus(id, status) {
    return this.executeMethod('updateUserStatus', { id }, { status });
  }

  async restoreUser(id) {
    return this.executeMethod('restoreUser', { id });
  }

  async getUserByEmail(email) {
    return this.executeMethod('getUserByEmail', { email });
  }

  async getUsersByStatus(status) {
    return this.executeMethod('getUsersByStatus', { status });
  }

  // Métodos de clientes
  async getAllClients() {
    return this.executeMethod('getAllClients');
  }

  async getClientById(id) {
    return this.executeMethod('getClientById', { id });
  }

  async createClient(clientData) {
    return this.executeMethod('createClient', {}, clientData);
  }

  async updateClient(id, clientData) {
    return this.executeMethod('updateClient', { id }, clientData);
  }

  async deleteClient(id) {
    return this.executeMethod('deleteClient', { id });
  }

  // Métodos de presupuestos
  async getAllBudgets() {
    return this.executeMethod('getAllBudgets');
  }

  async getBudgetById(id) {
    return this.executeMethod('getBudgetById', { id });
  }

  async createBudget(budgetData) {
    return this.executeMethod('createBudget', {}, budgetData);
  }

  async updateBudgetStatus(id, status) {
    return this.executeMethod('updateBudgetStatus', { id }, { status });
  }

  async getBudgetsByClient(clientId) {
    return this.executeMethod('getBudgetsByClient', { clientId });
  }

  // Métodos de notificaciones
  async getUserNotifications(userId, page = 0, size = 20) {
    return this.executeMethod('getUserNotifications', { userId, page, size });
  }

  async getNotificationStats(userId) {
    return this.executeMethod('getNotificationStats', { userId });
  }

  async createNotification(notificationData) {
    return this.executeMethod('createNotification', {}, notificationData);
  }

  async markNotificationAsRead(id) {
    return this.executeMethod('markAsRead', { id });
  }

  async markAllNotificationsAsRead(userId) {
    return this.executeMethod('markAllAsRead', { userId });
  }

  // Métodos de proyectos
  async getAllProjects() {
    return this.executeMethod('getAllProjects');
  }

  async getProjectById(id) {
    return this.executeMethod('getProjectById', { id });
  }

  async createProject(projectData) {
    return this.executeMethod('createProject', {}, projectData);
  }

  async updateProject(id, projectData) {
    return this.executeMethod('updateProject', { id }, projectData);
  }

  async deleteProject(id) {
    return this.executeMethod('deleteProject', { id });
  }

  // Métodos del dashboard
  async getDashboardSummary() {
    return this.executeMethod('getDashboardSummary');
  }

  async getDashboardData() {
    return this.executeMethod('getDashboardData');
  }

  // Métodos de salud del sistema
  async getHealth() {
    return this.executeMethod('getHealth');
  }

  // Métodos de logout
  async logout() {
    return this.executeMethod('logout');
  }

  // Validar datos contra esquemas
  validateData(schemaName, data) {
    if (!this.client) return true;
    return this.client.validateData(schemaName, data);
  }

  // Generar documentación
  generateDocumentation() {
    if (!this.client) return null;
    return this.client.generateDocs();
  }

  // Obtener lista de endpoints disponibles
  getAvailableEndpoints() {
    return Array.from(this.endpoints.keys());
  }

  // Verificar si un endpoint está disponible
  hasEndpoint(endpointName) {
    return this.endpoints.has(endpointName);
  }

  // Ejecutar método genérico
  async call(endpointName, params = {}, data = null) {
    return this.executeMethod(endpointName, params, data);
  }

  // Método para testing
  async testConnection() {
    try {
      const health = await this.getHealth();
      console.log('✅ OpenAPI Service: Conexión exitosa', health);
      return { success: true, data: health };
    } catch (error) {
      console.error('❌ OpenAPI Service: Error de conexión', error);
      return { success: false, error: error.message };
    }
  }

  // Método para obtener estadísticas del servicio
  getStats() {
    return {
      loaded: this.isLoaded,
      totalEndpoints: this.endpoints.size,
      availableEndpoints: this.getAvailableEndpoints(),
      serviceInfo: this.getServiceInfo()
    };
  }
}

// Instancia singleton del servicio
const openAPIService = new OpenAPIService();

// Función para inicializar el servicio
export const initializeOpenAPIService = async () => {
  return await openAPIService.initialize();
};

// Función para obtener la instancia del servicio
export const getOpenAPIService = () => {
  return openAPIService;
};

// Exportar métodos específicos para compatibilidad
export const {
  login,
  googleAuth,
  googleRegister,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  restoreUser,
  getUserByEmail,
  getUsersByStatus,
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudgetStatus,
  getBudgetsByClient,
  getUserNotifications,
  getNotificationStats,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getDashboardSummary,
  getDashboardData,
  getHealth,
  logout,
  validateData,
  generateDocumentation,
  getAvailableEndpoints,
  hasEndpoint,
  call,
  testConnection,
  getStats
} = openAPIService;

export default openAPIService; 