import { API_CONFIG, handleCorsError } from '../config/api';

class TimeEntryService {
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

  // Obtener todas las entradas de tiempo
  async getAllTimeEntries() {
    return this.request('/time-entries');
  }

  // Obtener entrada de tiempo por ID
  async getTimeEntryById(id) {
    return this.request(`/time-entries/${id}`);
  }

  // Crear entrada de tiempo
  async createTimeEntry(timeEntryData) {
    return this.request('/time-entries', {
      method: 'POST',
      body: JSON.stringify(this.sanitizeTimeEntryData(timeEntryData))
    });
  }

  // Actualizar entrada de tiempo
  async updateTimeEntry(id, timeEntryData) {
    return this.request(`/time-entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(this.sanitizeTimeEntryData(timeEntryData))
    });
  }

  // Eliminar entrada de tiempo
  async deleteTimeEntry(id) {
    return this.request(`/time-entries/${id}`, {
      method: 'DELETE'
    });
  }

  // Obtener entradas de tiempo por usuario
  async getTimeEntriesByUser(userId) {
    return this.request(`/time-entries/user/${userId}`);
  }

  // Obtener entradas de tiempo por proyecto
  async getTimeEntriesByProject(projectId) {
    return this.request(`/time-entries/project/${projectId}`);
  }

  // Obtener entradas de tiempo por tarea
  async getTimeEntriesByTask(taskId) {
    return this.request(`/time-entries/task/${taskId}`);
  }

  // Obtener entradas de tiempo por fecha
  async getTimeEntriesByDate(date) {
    return this.request(`/time-entries/date/${date}`);
  }

  // Obtener entradas de tiempo por estado
  async getTimeEntriesByStatus(status) {
    return this.request(`/time-entries/status/${status}`);
  }

  // Obtener entradas de tiempo facturables
  async getBillableTimeEntries() {
    return this.request('/time-entries/billable');
  }

  // Obtener entradas de tiempo por rango de fechas
  async getTimeEntriesByDateRange(startDate, endDate) {
    return this.request(`/time-entries/date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  // Obtener estadísticas de entradas de tiempo
  async getTimeEntryStats() {
    return this.request('/time-entries/statistics');
  }

  // Calcular duración en horas entre dos tiempos
  calculateDurationHours(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end - start;
    return diffMs / (1000 * 60 * 60); // Convertir a horas
  }

  // Sanitizar datos de la entrada de tiempo para enviar al backend
  sanitizeTimeEntryData(data) {
    const durationHours = data.startTime && data.endTime 
      ? this.calculateDurationHours(data.startTime, data.endTime)
      : 0;

    return {
      userId: parseInt(data.userId),
      projectId: data.projectId ? parseInt(data.projectId) : null,
      taskId: data.taskId ? parseInt(data.taskId) : null,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      durationHours: durationHours,
      description: data.description?.trim() || '',
      status: data.status || 'Pendiente',
      billable: Boolean(data.billable),
      billingRate: data.billingRate ? parseFloat(data.billingRate) : null
    };
  }
}

export const timeEntryService = new TimeEntryService(); 