// OpenAPI Client Generator
// Utilidad para generar clientes de API basados en la especificación OpenAPI

import { api } from '../config/api.js';

class OpenAPIClient {
  constructor(spec) {
    this.spec = spec;
    this.baseUrl = spec.servers?.[0]?.url || 'http://localhost:8080';
    this.paths = spec.paths || {};
    this.schemas = spec.components?.schemas || {};
    this.generatedMethods = {};
    
    this.generateClientMethods();
  }

  // Generar métodos del cliente basados en los paths de OpenAPI
  generateClientMethods() {
    Object.entries(this.paths).forEach(([path, pathItem]) => {
      Object.entries(pathItem).forEach(([method, operation]) => {
        const methodName = this.generateMethodName(operation.operationId || `${method}${path.replace(/\//g, '')}`);
        this.generatedMethods[methodName] = this.createMethod(path, method, operation);
      });
    });
  }

  // Generar nombre de método basado en operationId
  generateMethodName(operationId) {
    return operationId.charAt(0).toLowerCase() + operationId.slice(1);
  }

  // Crear método para una operación específica
  createMethod(path, method, operation) {
    return async (params = {}, data = null) => {
      const url = this.buildUrl(path, params);
      
      try { // Fixed redeclaration
        console.log(`🌐 OpenAPI Client: ${method.toUpperCase()} ${url}`);
        
        switch (method.toLowerCase()) {
          case 'get':
            return await api.get(url);
          case 'post':
            return await api.post(url, data);
          case 'put':
            return await api.put(url, data);
          case 'patch':
            return await api.put(url, data); // Usar PUT como fallback para PATCH
          case 'delete':
            return await api.delete(url);
          default:
            throw new Error(`Método HTTP no soportado: ${method}`);
        }
      } catch (error) {
        console.error(`❌ OpenAPI Client Error: ${method.toUpperCase()} ${url}`, error);
        throw error;
      }
    };
  }

  // Construir URL con parámetros de path
  buildUrl(path, params) {
    let url = path;
    
    // Reemplazar parámetros de path {id} con valores reales
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
    
    return url;
  }

  // Construir configuración de la petición
  buildConfig(method, data, operation) {
    const config = {
      method: method.toUpperCase()
    };

    if (data && ['post', 'put', 'patch'].includes(method.toLowerCase())) {
      config.body = JSON.stringify(data);
      config.headers = {
        'Content-Type': 'application/json'
      };
    }

    return config;
  }

  // Obtener todos los métodos generados
  getMethods() {
    return this.generatedMethods;
  }

  // Obtener información de la especificación
  getSpecInfo() {
    return {
      title: this.spec.info?.title,
      version: this.spec.info?.version,
      description: this.spec.info?.description,
      baseUrl: this.baseUrl,
      paths: Object.keys(this.paths),
      schemas: Object.keys(this.schemas)
    };
  }

  // Validar datos contra esquemas
  validateData(schemaName, data) {
    const schema = this.schemas[schemaName];
    if (!schema) {
      console.warn(`⚠️ Esquema no encontrado: ${schemaName}`);
      return true;
    }

    // Validación básica de tipos
    return this.validateSchema(schema, data);
  }

  // Validar esquema recursivamente
  validateSchema(schema, data) {
    if (!schema || !data) return true;

    switch (schema.type) {
      case 'object':
        return this.validateObject(schema, data);
      case 'array':
        return this.validateArray(schema, data);
      case 'string':
        return typeof data === 'string';
      case 'integer':
        return Number.isInteger(data);
      case 'number':
        return typeof data === 'number';
      case 'boolean':
        return typeof data === 'boolean';
      default:
        return true;
    }
  }

  // Validar objeto
  validateObject(schema, data) {
    if (typeof data !== 'object' || Array.isArray(data)) return false;

    const required = schema.required || [];
    for (const field of required) {
      if (!(field in data)) {
        console.warn(`⚠️ Campo requerido faltante: ${field}`);
        return false;
      }
    }

    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (key in data && !this.validateSchema(propSchema, data[key])) {
          console.warn(`⚠️ Validación fallida para campo: ${key}`);
          return false;
        }
      }
    }

    return true;
  }

  // Validar array
  validateArray(schema, data) {
    if (!Array.isArray(data)) return false;

    if (schema.items) {
      return data.every(item => this.validateSchema(schema.items, item));
    }

    return true;
  }

  // Generar documentación de la API
  generateDocs() {
    const docs = {
      info: this.getSpecInfo(),
      endpoints: []
    };

    Object.entries(this.paths).forEach(([path, pathItem]) => {
      Object.entries(pathItem).forEach(([method, operation]) => {
        docs.endpoints.push({
          path,
          method: method.toUpperCase(),
          operationId: operation.operationId,
          summary: operation.summary,
          tags: operation.tags,
          parameters: operation.parameters || [],
          requestBody: operation.requestBody,
          responses: operation.responses
        });
      });
    });

    return docs;
  }
}

// Función para cargar la especificación OpenAPI
export const loadOpenAPISpec = async () => {
  try {
    const response = await fetch('/openapi-spec.json');
    const spec = await response.json();
    return new OpenAPIClient(spec);
  } catch (error) {
    console.error('❌ Error cargando especificación OpenAPI:', error);
    throw error;
  }
};

// Función para crear cliente con especificación hardcodeada
export const createOpenAPIClient = (spec) => {
  return new OpenAPIClient(spec);
};

// Cliente predefinido para las operaciones más comunes
export const createDefaultClient = () => {
  const defaultSpec = {
    servers: [{ url: 'https://test2-ida01tly.b4a.run/api' }],
    paths: {
      '/api/auth/login': {
        post: {
          operationId: 'login',
          summary: 'Autenticar usuario'
        }
      },
      '/api/users': {
        get: {
          operationId: 'getAllUsers',
          summary: 'Obtener todos los usuarios'
        },
        post: {
          operationId: 'createUser',
          summary: 'Crear un nuevo usuario'
        }
      },
      '/api/clients': {
        get: {
          operationId: 'getAllClients',
          summary: 'Obtener todos los clientes'
        },
        post: {
          operationId: 'createClient',
          summary: 'Crear un nuevo cliente'
        }
      },
      '/api/budgets': {
        get: {
          operationId: 'getAllBudgets',
          summary: 'Obtener todos los presupuestos'
        },
        post: {
          operationId: 'createBudget',
          summary: 'Crear un nuevo presupuesto'
        }
      },
      '/api/notifications/user/{userId}': {
        get: {
          operationId: 'getUserNotifications',
          summary: 'Obtener notificaciones de un usuario'
        }
      },
      '/api/dashboard/summary': {
        get: {
          operationId: 'getDashboardSummary',
          summary: 'Obtener resumen del dashboard'
        }
      },
      '/api/health': {
        get: {
          operationId: 'getHealth',
          summary: 'Verificar salud del sistema'
        }
      }
    }
  };

  return new OpenAPIClient(defaultSpec);
};

export default OpenAPIClient; 