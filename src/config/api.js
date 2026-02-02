// Configuración de la API para comunicación REST con Spring Boot
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://test2-ida01tly.b4a.run/api',
  // BASE_URL: 'https://test2-ida01tly.b4a.run/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Función para manejar errores de CORS y conexión
export const handleCorsError = (error) => {
  console.error('🔍 API Error Details:', {
    message: error.message,
    name: error.name,
    stack: error.stack
  });

  if (error.message.includes('CORS')) {
    console.error('❌ Error de CORS detectado. Verifica que el backend (localhost:8080) permita el origen actual.');
    return 'Error de conexión (CORS). El backend rechazó la conexión.';
  }
  
  if (error.message.includes('Failed to fetch')) {
    console.error('❌ Error de conexión (Failed to fetch). Posibles causas: Backend apagado, puerto incorrecto, o red bloqueada.');
    return 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en el puerto 8080.';
  }
  
  return error.message;
};

// Función para retry automático
const retryRequest = async (url, config, attempts = API_CONFIG.RETRY_ATTEMPTS) => {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url, config);
      
      if (response.ok) {
        return response;
      }
      
      // Si es el último intento, lanzar error
      if (i === attempts - 1) {
        return response;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * (i + 1)));
      
    } catch (error) {
      // Si es el último intento, lanzar error
      if (i === attempts - 1) {
        throw error;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * (i + 1)));
    }
  }
};

// Función principal para hacer requests a la API REST
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const config = {
    headers: API_CONFIG.HEADERS,
    ...options
  };

  try {
    // Agregar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    const response = await retryRequest(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. El servidor tardó demasiado en responder.');
    }
    
    const errorMessage = handleCorsError(error);
    throw new Error(errorMessage);
  }
};

// Cache simple para requests GET
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const getCachedResponse = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedResponse = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// API methods con cache para GET - Adaptado para REST
export const api = {
  get: async (endpoint) => {
    const cacheKey = `GET:${endpoint}`;
    const cached = getCachedResponse(cacheKey);
    
    if (cached) {
      console.log(`📦 Cache hit for ${endpoint}`);
      return cached;
    }
    
    const data = await apiRequest(endpoint);
    setCachedResponse(cacheKey, data);
    return data;
  },
  
  post: (endpoint, data) => {
    // Limpiar cache relacionado
    cache.clear();
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put: (endpoint, data) => {
    // Limpiar cache relacionado
    cache.clear();
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: (endpoint) => {
    // Limpiar cache relacionado
    cache.clear();
    return apiRequest(endpoint, {
      method: 'DELETE'
    });
  }
};

// Función para limpiar cache
export const clearApiCache = () => {
  cache.clear();
  console.log('🗑️ API cache cleared');
};

// Función para obtener estadísticas del cache
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
};

// Función para verificar conectividad con el backend
export const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: API_CONFIG.HEADERS
    });
    return response.ok;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
}; 