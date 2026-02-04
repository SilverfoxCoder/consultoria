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

  // Obtener equipo del proyecto
  async getProjectTeam(projectId) {
    return this.request(`/project-teams/project/${projectId}`);
  }

  // --- Gestión de Documentos ---

  // Obtener documentos del proyecto
  async getProjectDocuments(projectId) {
    return this.request(`/projects/${projectId}/documents`);
  }

  // Subir documento
  async uploadProjectDocument(projectId, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Custom request for FormData (no JSON headers)
    const url = `${this.baseURL}/projects/${projectId}/documents`;
    const token = localStorage.getItem('token'); // Assuming auth token is stored there if needed
    
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    // Note: Content-Type for FormData is set automatically by browser

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: headers
        });

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

  // Eliminar documento
  async deleteDocument(documentId) {
    return this.request(`/documents/${documentId}`, {
      method: 'DELETE'
    });
  }

  // Obtener URL de descarga (helper para usar en href)
  getDownloadDocumentUrl(documentId) {
    return `${this.baseURL}/documents/${documentId}/download`;
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
      jiraUrl: data.jiraUrl?.trim() || null,
      jiraProjectKey: data.jiraProjectKey?.trim() || null,
      jiraBoardId: data.jiraBoardId?.trim() || null,
      teamMemberIds: Array.isArray(data.teamMemberIds) ? data.teamMemberIds : []
    };
  }
}

export const projectService = new ProjectService(); 