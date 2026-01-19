import { api } from '../config/api';
import { mockDataService } from './mockDataService';

export const serviceService = {
  // Obtener todos los servicios
  getAllServices: async () => {
    try {
      return await api.get('/services');
    } catch (error) {
      console.warn('API error, using mock data:', error);
      return mockDataService.getMockServices();
    }
  },

  // Obtener servicio por ID
  getServiceById: async (id) => {
    return await api.get(`/services/${id}`);
  },

  // Obtener servicios por tipo
  getServicesByType: async (type) => {
    return await api.get(`/services/type/${type}`);
  },

  // Obtener servicios por estado
  getServicesByStatus: async (status) => {
    return await api.get(`/services/status/${status}`);
  },

  // Obtener servicios por cliente
  getServicesByClient: async (clientId) => {
    try {
      const response = await api.get(`/services/client/${clientId}`);
      // If response is empty or null, return mock data for demonstration
      if (!response || (Array.isArray(response) && response.length === 0)) {
         console.log('No services found from API, using mock data for demo');
         return mockDataService.getMockServices();
      }
      return response;
    } catch (error) {
      console.warn('Error fetching services, using fallback mock data:', error);
      return mockDataService.getMockServices();
    }
  },

  // Crear nuevo servicio
  createService: async (serviceData) => {
    try {
      return await api.post('/services', serviceData);
    } catch (error) {
      console.warn('API error creating service, using mock:', error);
      return mockDataService.createMockService(serviceData);
    }
  },

  // Actualizar servicio
  updateService: async (id, serviceData) => {
    return await api.put(`/services/${id}`, serviceData);
  },

  // Eliminar servicio
  deleteService: async (id) => {
    return await api.delete(`/services/${id}`);
  },

  // Obtener entregables del servicio
  getServiceDeliverables: async (serviceId) => {
    return await api.get(`/service-deliverables/service/${serviceId}`);
  },

  // Crear entregable
  createServiceDeliverable: async (deliverableData) => {
    return await api.post('/service-deliverables', deliverableData);
  },

  // Actualizar entregable
  updateServiceDeliverable: async (id, deliverableData) => {
    return await api.put(`/service-deliverables/${id}`, deliverableData);
  },

  // Eliminar entregable
  deleteServiceDeliverable: async (id) => {
    return await api.delete(`/service-deliverables/${id}`);
  },

  // Obtener estadísticas de servicios
  getServiceStats: async () => {
    const services = await serviceService.getAllServices();
    
    return {
      total: services.length,
      completados: services.filter(s => s.status === 'completed').length,
      enProgreso: services.filter(s => s.status === 'in-progress').length,
      pendientes: services.filter(s => s.status === 'pending').length,
      montoTotal: services.reduce((sum, s) => sum + (s.amount || 0), 0)
    };
  }
}; 