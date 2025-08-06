import { API_CONFIG, handleCorsError } from '../config/api';

class RoleService {
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

  // Obtener todos los roles
  async getAllRoles() {
    return this.request('/roles');
  }

  // Obtener rol por ID
  async getRoleById(id) {
    return this.request(`/roles/${id}`);
  }

  // Crear rol
  async createRole(roleData) {
    return this.request('/roles', {
      method: 'POST',
      body: JSON.stringify(this.sanitizeRoleData(roleData))
    });
  }

  // Actualizar rol
  async updateRole(id, roleData) {
    return this.request(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(this.sanitizeRoleData(roleData))
    });
  }

  // Eliminar rol
  async deleteRole(id) {
    return this.request(`/roles/${id}`, {
      method: 'DELETE'
    });
  }

  // Obtener roles activos
  async getActiveRoles() {
    return this.request('/roles/active');
  }

  // Buscar roles por nombre
  async searchRolesByName(name) {
    return this.request(`/roles/search?name=${encodeURIComponent(name)}`);
  }

  // Obtener roles por permiso
  async getRolesByPermission(permissionId) {
    return this.request(`/roles/permission/${permissionId}`);
  }

  // Obtener roles por usuario
  async getRolesByUser(userId) {
    return this.request(`/roles/user/${userId}`);
  }

  // Obtener estadísticas de roles
  async getRoleStats() {
    return this.request('/roles/statistics');
  }

  // Agregar permisos a un rol
  async addPermissionsToRole(roleId, permissionIds) {
    return this.request(`/roles/${roleId}/permissions`, {
      method: 'POST',
      body: JSON.stringify({ permissionIds })
    });
  }

  // Remover permiso de un rol
  async removePermissionFromRole(roleId, permissionId) {
    return this.request(`/roles/${roleId}/permissions/${permissionId}`, {
      method: 'DELETE'
    });
  }

  // Sanitizar datos del rol para enviar al backend
  sanitizeRoleData(data) {
    return {
      name: data.name?.trim(),
      description: data.description?.trim() || '',
      isActive: Boolean(data.isActive),
      permissionIds: Array.isArray(data.permissionIds) ? data.permissionIds : []
    };
  }
}

export const roleService = new RoleService(); 