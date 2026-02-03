import { API_CONFIG, handleCorsError } from '../config/api';

class UserService {
  async request(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    console.log(`📡 UserService: Request to ${url}`);
    const config = {
      headers: API_CONFIG.HEADERS,
      credentials: 'include',
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      const errorMessage = handleCorsError(error);
      throw new Error(errorMessage);
    }
  }

  // Obtener todos los usuarios
  async getAllUsers() {
    const token = localStorage.getItem('xperiecia_token');
    return this.request('/users', {
      method: 'GET',
      headers: {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Obtener usuario por ID
  async getUserById(id) {
    const token = localStorage.getItem('xperiecia_token');
    return this.request(`/users/${id}`, {
      method: 'GET',
      headers: {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Obtener usuario por email
  async getUserByEmail(email) {
    return this.request(`/users/email/${encodeURIComponent(email)}`);
  }

  // Crear usuario
  async createUser(userData) {
    const token = localStorage.getItem('xperiecia_token');
    return this.request('/users', {
      method: 'POST',
      headers: {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(this.sanitizeUserData(userData))
    });
  }

  // Actualizar usuario
  async updateUser(id, userData) {
    const token = localStorage.getItem('xperiecia_token');
    return this.request(`/users/${id}`, {
      method: 'PUT',
      headers: {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(this.sanitizeUserData(userData))
    });
  }

  // Eliminar usuario
  async deleteUser(id) {
    const token = localStorage.getItem('xperiecia_token');
    console.log(`🗑️ UserService: Eliminando usuario ${id}`);
    console.log(`🔑 Token disponible: ${!!token}`);
    
    return this.request(`/users/${id}`, {
      method: 'DELETE',
      headers: {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Cambiar estado de usuario (activar/desactivar)
  async updateUserStatus(id, status) {
    const token = localStorage.getItem('xperiecia_token');
    console.log(`🔄 UserService: Cambiando estado usuario ${id} a ${status}`);
    console.log(`🔑 Token disponible: ${!!token}`);
    
    return this.request(`/users/${id}/status`, {
      method: 'PATCH',
      headers: {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
  }

  // Obtener usuarios por rol
  async getUsersByRole(role) {
    return this.request(`/users/role/${role}`);
  }

  // Obtener usuarios activos
  async getActiveUsers() {
    return this.request('/users/active');
  }

  // Buscar usuarios por nombre
  async searchUsersByName(name) {
    return this.request(`/users/search?name=${encodeURIComponent(name)}`);
  }

  // Autenticación con backend Spring Boot
  async authenticate(email, password) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Credenciales incorrectas');
      }

      const authData = await response.json();
      return {
        user: authData.user,
        token: authData.token,
        userType: authData.userType || 'admin'
      };
    } catch (error) {
      const errorMessage = handleCorsError(error);
      throw new Error(errorMessage);
    }
  }

  // Verificar autenticación
  async verifyAuth(token) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Auth verification failed:', error);
      return false;
    }
  }

  // Cerrar sesión
  async logout(token) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }

  // Cambiar contraseña
  async changePassword(userId, oldPassword, newPassword, token) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error al cambiar contraseña');
      }

      return await response.json();
    } catch (error) {
      const errorMessage = handleCorsError(error);
      throw new Error(errorMessage);
    }
  }

  // Verificar si es el primer login
  async checkFirstLogin(userId, token) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/first-login/${userId}`, {
        method: 'GET',
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.isFirstLogin || false;
    } catch (error) {
      console.error('First login check failed:', error);
      return false;
    }
  }

  // Sanitizar datos del usuario para enviar al backend
  sanitizeUserData(data) {
    return {
      name: data.name?.trim(),
      email: data.email?.trim(),
      password: data.password,
      role: data.role || 'USER',
      isActive: Boolean(data.isActive),
      phone: data.phone?.trim() || '',
      department: data.department?.trim() || '',
      position: data.position?.trim() || ''
    };
  }
}

export const userService = new UserService(); 