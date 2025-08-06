import { API_CONFIG } from '../config/api';

class AuthService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.headers = API_CONFIG.HEADERS;
  }

  // Método auxiliar para realizar peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      console.log('🔍 AuthService: Realizando petición');
      console.log('  URL:', url);
      console.log('  Método:', options.method || 'GET');
      console.log('  Headers:', options.headers);

      const response = await fetch(url, {
        headers: {
          ...this.headers,
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      });

      console.log('📥 AuthService: Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ AuthService: Error en respuesta:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ AuthService: Datos parseados exitosamente');
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🌐 AuthService: Error de red - no se pudo conectar al servidor');
        throw new Error('No se pudo conectar al servidor. Verifica tu conexión.');
      } else if (error.name === 'AbortError') {
        console.error('⏱️ AuthService: Timeout - la petición tardó demasiado');
        throw new Error('La petición tardó demasiado tiempo. Intenta nuevamente.');
      }
      
      console.error('❌ AuthService: Error:', error);
      throw error;
    }
  }

  // Login de usuario
  async login(credentials) {
    try {
      console.log('🔐 AuthService: Iniciando login');
      console.log('  Email:', credentials.email);

      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('✅ AuthService: Login exitoso');
      return response;
    } catch (error) {
      console.error('❌ AuthService: Error en login:', error);
      throw error;
    }
  }

  // Registro de nuevo usuario (cliente)
  async register(userData) {
    try {
      console.log('📝 AuthService: Iniciando registro de usuario');
      console.log('  Email:', userData.email);
      console.log('  Nombre:', userData.name);
      console.log('  Rol:', userData.role);

      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      console.log('✅ AuthService: Registro exitoso');
      return response;
    } catch (error) {
      console.error('❌ AuthService: Error en registro:', error);
      throw error;
    }
  }

  // Verificar token de autenticación
  async verifyToken() {
    try {
      const token = localStorage.getItem('codethics_token');
      
      if (!token) {
        throw new Error('No hay token disponible');
      }

      console.log('🔍 AuthService: Verificando token');

      const response = await this.request('/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ AuthService: Token válido');
      return response;
    } catch (error) {
      console.error('❌ AuthService: Error al verificar token:', error);
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      const token = localStorage.getItem('codethics_token');
      
      if (token) {
        console.log('🚪 AuthService: Cerrando sesión en servidor');
        
        await this.request('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      // Limpiar token local independientemente del resultado del servidor
      localStorage.removeItem('codethics_token');
      console.log('✅ AuthService: Sesión cerrada localmente');
      
    } catch (error) {
      console.error('❌ AuthService: Error en logout (limpiando localmente):', error);
      // Limpiar token local incluso si falla el logout en servidor
      localStorage.removeItem('codethics_token');
    }
  }

  // Solicitar recuperación de contraseña
  async requestPasswordReset(email) {
    try {
      console.log('🔄 AuthService: Solicitando recuperación de contraseña para:', email);

      const response = await this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      console.log('✅ AuthService: Solicitud de recuperación enviada');
      return response;
    } catch (error) {
      console.error('❌ AuthService: Error al solicitar recuperación:', error);
      throw error;
    }
  }

  // Resetear contraseña con token
  async resetPassword(token, newPassword) {
    try {
      console.log('🔄 AuthService: Reseteando contraseña');

      const response = await this.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });

      console.log('✅ AuthService: Contraseña reseteada exitosamente');
      return response;
    } catch (error) {
      console.error('❌ AuthService: Error al resetear contraseña:', error);
      throw error;
    }
  }

  // Cambiar contraseña (usuario autenticado)
  async changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem('codethics_token');
      
      if (!token) {
        throw new Error('Usuario no autenticado');
      }

      console.log('🔄 AuthService: Cambiando contraseña');

      const response = await this.request('/auth/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      console.log('✅ AuthService: Contraseña cambiada exitosamente');
      return response;
    } catch (error) {
      console.error('❌ AuthService: Error al cambiar contraseña:', error);
      throw error;
    }
  }

  // Autenticación con Google OAuth
  async googleAuth(googleUserData) {
    try {
      console.log('🟢 AuthService: Iniciando autenticación con Google');
      console.log('  Email:', googleUserData.email);
      console.log('  Nombre:', googleUserData.name);
      console.log('  Google ID:', googleUserData.googleId);

      const authData = {
        googleId: googleUserData.googleId,
        email: googleUserData.email,
        name: googleUserData.name,
        picture: googleUserData.picture,
        firstName: googleUserData.firstName,
        lastName: googleUserData.lastName,
        provider: 'google'
      };

      const response = await this.request('/auth/google', {
        method: 'POST',
        body: JSON.stringify(authData),
      });

      console.log('✅ AuthService: Autenticación con Google exitosa');
      return response;
    } catch (error) {
      console.error('❌ AuthService: Error en autenticación con Google:', error);
      throw error;
    }
  }

  // Registro con Google OAuth (para nuevos usuarios)
  async googleRegister(googleUserData, additionalData = {}) {
    try {
      console.log('🟢 AuthService: Iniciando registro con Google');
      console.log('  Email:', googleUserData.email);
      console.log('  Nombre:', googleUserData.name);

      const registerData = {
        googleId: googleUserData.googleId,
        email: googleUserData.email,
        name: googleUserData.name,
        picture: googleUserData.picture,
        firstName: googleUserData.firstName,
        lastName: googleUserData.lastName,
        provider: 'google',
        role: 'client', // Por defecto, usuarios de Google son clientes
        ...additionalData // Datos adicionales como empresa, teléfono, etc.
      };

      const response = await this.request('/auth/google/register', {
        method: 'POST',
        body: JSON.stringify(registerData),
      });

      console.log('✅ AuthService: Registro con Google exitoso');
      return response;
    } catch (error) {
      console.error('❌ AuthService: Error en registro con Google:', error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;