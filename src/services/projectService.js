import { API_CONFIG, handleCorsError } from '../config/api';

class ProjectService {
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
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      const errorMessage = handleCorsError(error);
      throw new Error(errorMessage);
    }
  }

  // Obtener todos los proyectos
  async getAllProjects() {
    return this.request('/projects');
  }

  // Obtener proyecto por ID
  async getProjectById(id) {
    return this.request(`/projects/${id}`);
  }

  // Crear proyecto
  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(this.sanitizeProjectData(projectData))
    });
  }

  // Actualizar proyecto
  async updateProject(id, projectData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(this.sanitizeProjectData(projectData))
    });
  }

  // Eliminar proyecto
  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE'
    });
  }

  // Obtener proyectos por cliente
  async getProjectsByClient(clientId) {
    return this.request(`/projects/client/${clientId}`);
  }

  // Obtener proyectos por estado
  async getProjectsByStatus(status) {
    return this.request(`/projects/status/${status}`);
  }

  // Obtener proyectos por prioridad
  async getProjectsByPriority(priority) {
    return this.request(`/projects/priority/${priority}`);
  }

  // Obtener proyectos activos
  async getActiveProjects() {
    return this.request('/projects/active');
  }

  // Obtener proyectos con progreso bajo
  async getProjectsWithLowProgress() {
    return this.request('/projects/low-progress');
  }

  // Obtener proyectos que exceden presupuesto
  async getProjectsOverBudget() {
    return this.request('/projects/over-budget');
  }

  // Obtener estadísticas
  async getProjectStats() {
    return this.request('/projects/stats');
  }

  // Sanitizar datos del proyecto para enviar al backend
  sanitizeProjectData(data) {
    return {
      name: data.name?.trim(),
      clientId: parseInt(data.clientId),
      status: data.status || 'PLANIFICACION',
      progress: parseInt(data.progress) || 0,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: parseFloat(data.budget) || 0,
      spent: parseFloat(data.spent) || 0,
      priority: data.priority || 'MEDIA',
      description: data.description?.trim() || '',
      jiraEnabled: Boolean(data.jiraEnabled),
      jiraUrl: data.jiraUrl?.trim() || null,
      jiraProjectKey: data.jiraProjectKey?.trim() || null,
      jiraBoardId: data.jiraBoardId?.trim() || null
    };
  }
}

export const projectService = new ProjectService(); 