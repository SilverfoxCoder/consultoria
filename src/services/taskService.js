import { API_CONFIG, handleCorsError } from '../config/api';

class TaskService {
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

  // Obtener todas las tareas
  async getAllTasks() {
    return this.request('/tasks');
  }

  // Obtener tarea por ID
  async getTaskById(id) {
    return this.request(`/tasks/${id}`);
  }

  // Crear tarea
  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(this.sanitizeTaskData(taskData))
    });
  }

  // Actualizar tarea
  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(this.sanitizeTaskData(taskData))
    });
  }

  // Eliminar tarea
  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }

  // Obtener tareas por proyecto
  async getTasksByProject(projectId) {
    return this.request(`/tasks/project/${projectId}`);
  }

  // Obtener tareas por usuario asignado
  async getTasksByUser(userId) {
    return this.request(`/tasks/user/${userId}`);
  }

  // Obtener tareas por estado
  async getTasksByStatus(status) {
    return this.request(`/tasks/status/${status}`);
  }

  // Obtener tareas por prioridad
  async getTasksByPriority(priority) {
    return this.request(`/tasks/priority/${priority}`);
  }

  // Obtener tareas vencidas
  async getOverdueTasks() {
    return this.request('/tasks/overdue');
  }

  // Obtener estadísticas de tareas
  async getTaskStats() {
    return this.request('/tasks/statistics');
  }

  // Sanitizar datos de la tarea para enviar al backend
  sanitizeTaskData(data) {
    return {
      title: data.title?.trim(),
      description: data.description?.trim() || '',
      projectId: parseInt(data.projectId),
      assignedToId: data.assignedToId ? parseInt(data.assignedToId) : null,
      assignee: data.assignee || data.assignedTo || '', // Handle text input from current form
      status: data.status || 'PENDIENTE', // Default to Enum value
      priority: data.priority || 'MEDIA',
      estimatedHours: data.estimatedHours ? parseFloat(data.estimatedHours) : null,
      actualHours: data.actualHours ? parseFloat(data.actualHours) : null,
      startDate: data.startDate || null,
      dueDate: data.dueDate || null,
      completedDate: data.completedDate || null
    };
  }
}

export const taskService = new TaskService(); 