import { API_CONFIG, handleCorsError } from '../config/api';

class PermissionService {
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

  // Obtener todos los permisos
  async getAllPermissions() {
    return this.request('/permissions');
  }

  // Obtener permiso por ID
  async getPermissionById(id) {
    return this.request(`/permissions/${id}`);
  }

  // Crear permiso
  async createPermission(permissionData) {
    return this.request('/permissions', {
      method: 'POST',
      body: JSON.stringify(this.sanitizePermissionData(permissionData))
    });
  }

  // Actualizar permiso
  async updatePermission(id, permissionData) {
    return this.request(`/permissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(this.sanitizePermissionData(permissionData))
    });
  }

  // Eliminar permiso
  async deletePermission(id) {
    return this.request(`/permissions/${id}`, {
      method: 'DELETE'
    });
  }

  // Obtener permisos activos
  async getActivePermissions() {
    return this.request('/permissions/active');
  }

  // Buscar permisos por nombre
  async searchPermissionsByName(name) {
    return this.request(`/permissions/search?name=${encodeURIComponent(name)}`);
  }

  // Obtener permisos por recurso
  async getPermissionsByResource(resource) {
    return this.request(`/permissions/resource/${encodeURIComponent(resource)}`);
  }

  // Obtener permisos por acción
  async getPermissionsByAction(action) {
    return this.request(`/permissions/action/${encodeURIComponent(action)}`);
  }

  // Obtener permisos por rol
  async getPermissionsByRole(roleId) {
    return this.request(`/permissions/role/${roleId}`);
  }

  // Obtener todos los recursos distintos
  async getAllResources() {
    return this.request('/permissions/resources');
  }

  // Obtener todas las acciones distintas
  async getAllActions() {
    return this.request('/permissions/actions');
  }

  // Obtener estadísticas de permisos
  async getPermissionStats() {
    return this.request('/permissions/statistics');
  }

  // Agregar roles a un permiso
  async addRolesToPermission(permissionId, roleIds) {
    return this.request(`/permissions/${permissionId}/roles`, {
      method: 'POST',
      body: JSON.stringify({ roleIds })
    });
  }

  // Remover rol de un permiso
  async removeRoleFromPermission(permissionId, roleId) {
    return this.request(`/permissions/${permissionId}/roles/${roleId}`, {
      method: 'DELETE'
    });
  }

  // Sanitizar datos del permiso para enviar al backend
  sanitizePermissionData(data) {
    return {
      name: data.name?.trim(),
      description: data.description?.trim() || '',
      resource: data.resource?.trim(),
      action: data.action?.trim(),
      isActive: Boolean(data.isActive),
      roleIds: Array.isArray(data.roleIds) ? data.roleIds : []
    };
  }
}

export const permissionService = new PermissionService(); 