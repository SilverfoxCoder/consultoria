# Documentación Completa - Sistema de Consultoría IT

## 📋 Índice
1. [Configuración del Proyecto](#configuración-del-proyecto)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Sistemas Implementados](#sistemas-implementados)
4. [Integración OpenAPI](#integración-openapi)
5. [Gestión de Usuarios](#gestión-de-usuarios)
6. [Sistema de Notificaciones](#sistema-de-notificaciones)
7. [Autenticación y Seguridad](#autenticación-y-seguridad)
8. [Base de Datos](#base-de-datos)
9. [API Endpoints](#api-endpoints)
10. [Configuración CORS](#configuración-cors)
11. [Troubleshooting](#troubleshooting)
12. [Comandos Útiles](#comandos-útiles)

---

## 🚀 Configuración del Proyecto

### Estructura del Proyecto
```
consultoria/
├── 📚 Documentación
│   ├── DOCUMENTACION_COMPLETA.md      # Documentación técnica consolidada
│   ├── CLIENT_SELECTION_UPDATE.md     # Actualización específica de clientes
│   ├── LIMPIEZA_PROYECTO.md          # Este archivo
│   └── README.md                      # Documentación general
├── 💻 Código Fuente
│   ├── src/                           # Código React
│   ├── public/                        # Archivos públicos
│   └── database/                      # Scripts de base de datos
├── ⚙️ Configuración
│   ├── package.json                   # Dependencias Node.js
│   ├── package-lock.json              # Lock file
│   ├── postcss.config.js              # Configuración PostCSS
│   └── tailwind.config.js             # Configuración Tailwind
└── 📦 node_modules/                   # Dependencias instaladas
```

### Tecnologías Utilizadas
- **Frontend:** React, Tailwind CSS, Headless UI
- **Backend:** Spring Boot, MySQL
- **Comunicación:** REST API
- **Base de Datos:** MySQL

---

## 🏗️ Arquitectura del Sistema

### Frontend (React)
- **Componentes:** Dashboard, ProjectManagement, ClientManagement
- **Servicios:** REST API calls con fetch
- **Estado:** React Hooks (useState, useEffect)
- **UI:** Tailwind CSS + Headless UI

### Backend (Spring Boot)
- **Controllers:** REST endpoints
- **Services:** Lógica de negocio
- **Repositories:** Acceso a datos
- **DTOs:** Data Transfer Objects
- **Entities:** Mapeo de base de datos

### Comunicación
- **Protocolo:** HTTP REST
- **Formato:** JSON
- **CORS:** Configurado para localhost:3000 ↔ localhost:8080

---

## 🔄 Adaptación REST

### Cambios Implementados

#### 1. Configuración API
```javascript
// src/config/api.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
```

#### 2. Servicios Refactorizados
- **PermissionService:** Gestión de permisos
- **ClientService:** CRUD de clientes
- **ProjectService:** Gestión de proyectos
- **UserService:** Autenticación y usuarios
- **StatusService:** Monitoreo del sistema

#### 3. Manejo de Errores
```javascript
export const handleCorsError = (error) => {
  if (error.message.includes('Failed to fetch')) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8080.';
  }
  return error.message;
};
```

#### 4. Polling para Actualizaciones
```javascript
// src/services/statusService.js
class StatusService {
  startPolling(callback, interval = 5000) {
    this.pollingInterval = setInterval(callback, interval);
  }
  
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
}
```

---

## 📊 Gestión de Proyectos

### Selección de Clientes por Nombre

#### Antes (ID Manual)
```javascript
// ❌ Usuario tenía que conocer IDs
<input type="number" name="client" placeholder="ID del cliente (ej: 1, 2, 3...)" />
```

#### Después (Dropdown por Nombre)
```javascript
// ✅ Selección intuitiva por nombre
<Listbox value={formData.clientName}>
  {clients.map(client => (
    <Listbox.Option key={client.id} value={client.name}>
      {client.name}
    </Listbox.Option>
  ))}
</Listbox>
```

#### Lógica de Resolución
```javascript
// Buscar cliente por nombre y obtener ID
const selectedClient = clients.find(client => client.name === formData.clientName);
const clientId = selectedClient.id;
```

### Estructura de Datos del Proyecto
```javascript
const projectData = {
  name: "Nombre del Proyecto",
  clientId: 1,                    // ID resuelto del cliente
  status: "PLANIFICACION",        // Enum del backend
  progress: 0,                    // Progreso por defecto
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  budget: 50000.00,
  spent: 0,                       // Gastado por defecto
  priority: "MEDIA",              // Enum del backend
  description: "Descripción del proyecto"
};
```

---

## 🗄️ Base de Datos

### Tablas Principales

#### Clientes (clients)
```sql
CREATE TABLE clients (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  contactPerson VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  industry VARCHAR(100),
  status VARCHAR(50),
  address TEXT,
  website VARCHAR(255),
  notes TEXT,
  lastContact DATETIME,
  totalRevenue DECIMAL(15,2),
  totalProjects INT
);
```

#### Proyectos (projects)
```sql
CREATE TABLE projects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  clientId BIGINT NOT NULL,
  status VARCHAR(50) NOT NULL,
  progress INT DEFAULT 0,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  budget DECIMAL(15,2) NOT NULL,
  spent DECIMAL(15,2) DEFAULT 0,
  priority VARCHAR(50) NOT NULL,
  description TEXT,
  FOREIGN KEY (clientId) REFERENCES clients(id)
);
```

### Estructura Backend (Spring Boot)

#### Entidad Project
```java
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "client_id", nullable = false)
    private Long clientId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProjectStatus status = ProjectStatus.PLANIFICACION;
    
    @Column(name = "progress")
    private Integer progress = 0;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "budget", precision = 15, scale = 2)
    private BigDecimal budget = BigDecimal.ZERO;
    
    @Column(name = "spent", precision = 15, scale = 2)
    private BigDecimal spent = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private ProjectPriority priority = ProjectPriority.MEDIA;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}

// Enums
public enum ProjectStatus {
    PLANIFICACION, EN_PROGRESO, COMPLETADO, CANCELADO, PAUSADO
}

public enum ProjectPriority {
    BAJA, MEDIA, ALTA, CRITICA
}
```

### Configuración de Base de Datos

#### Script SQL Completo
```sql
-- Crear tabla de proyectos con índices y restricciones
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Nombre del proyecto',
    clientId BIGINT NOT NULL COMMENT 'ID del cliente asociado',
    status ENUM('PLANIFICACION', 'EN_PROGRESO', 'COMPLETADO', 'CANCELADO', 'PAUSADO') DEFAULT 'PLANIFICACION',
    progress INT DEFAULT 0 COMMENT 'Progreso del proyecto (0-100)',
    startDate DATE NOT NULL COMMENT 'Fecha de inicio del proyecto',
    endDate DATE NOT NULL COMMENT 'Fecha de finalización del proyecto',
    budget DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Presupuesto total del proyecto',
    spent DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Gasto actual del proyecto',
    priority ENUM('BAJA', 'MEDIA', 'ALTA', 'CRITICA') DEFAULT 'MEDIA',
    description TEXT COMMENT 'Descripción detallada del proyecto',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para mejorar el rendimiento
    INDEX idx_clientId (clientId),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_startDate (startDate),
    INDEX idx_endDate (endDate),
    INDEX idx_createdAt (createdAt),
    
    -- Restricciones
    CONSTRAINT chk_dates CHECK (endDate >= startDate),
    CONSTRAINT chk_progress CHECK (progress >= 0 AND progress <= 100),
    CONSTRAINT chk_budget CHECK (budget >= 0),
    CONSTRAINT chk_spent CHECK (spent >= 0),
    
    -- Clave foránea al cliente
    FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Datos de Ejemplo
```sql
-- Cliente de prueba
INSERT INTO clients (name, contactPerson, email, phone, company, industry, status) 
VALUES ('Fernando Noguera Rodriguez', 'Fernando Noguera Rodriguez', 
        'fullconnectivity@gmail.com', '670835822', 'EMPRESA TEST', 'Tecnología', 'Prospecto');

-- Proyecto de prueba
INSERT INTO projects (name, clientId, status, startDate, endDate, budget, priority, description)
VALUES ('Sistema de Gestión Web', 1, 'PLANIFICACION', '2024-01-01', '2024-12-31', 50000.00, 'MEDIA', 'Desarrollo de sistema web completo');
```

---

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/login           # Autenticar usuario
POST   /api/auth/logout          # Cerrar sesión
POST   /api/auth/change-password # Cambiar contraseña del usuario
GET    /api/auth/verify          # Verificar autenticación
GET    /api/auth/first-login/{userId} # Verificar si es el primer login
```

### Clientes
```
GET    /api/clients              # Obtener todos los clientes
GET    /api/clients/{id}         # Obtener cliente por ID
POST   /api/clients              # Crear cliente
PUT    /api/clients/{id}         # Actualizar cliente
DELETE /api/clients/{id}         # Eliminar cliente
GET    /api/clients/active       # Clientes activos
GET    /api/clients/search?name= # Buscar por nombre
```

### Proyectos
```
GET    /api/projects             # Obtener todos los proyectos
GET    /api/projects/{id}        # Obtener proyecto por ID
POST   /api/projects             # Crear proyecto
PUT    /api/projects/{id}        # Actualizar proyecto
DELETE /api/projects/{id}        # Eliminar proyecto
```

### Autenticación
```
POST   /api/auth/login           # Autenticar usuario
POST   /api/auth/logout          # Cerrar sesión
POST   /api/auth/change-password # Cambiar contraseña del usuario
GET    /api/auth/verify          # Verificar autenticación
GET    /api/auth/first-login/{userId} # Verificar si es el primer login
```

### Estado del Sistema
```
GET    /api/status/system        # Estado del sistema
GET    /api/health               # Salud del backend
```

---

## 🌐 Configuración CORS

### Backend (Spring Boot)
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Frontend (React)
```javascript
// Configuración automática en API_CONFIG
const config = {
  headers: API_CONFIG.HEADERS,
  ...options
};
```

---

## 🛠️ Comandos Útiles

### Desarrollo Frontend
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build
```

### Desarrollo Backend
```bash
# Compilar proyecto
mvn clean compile

# Ejecutar aplicación
mvn spring-boot:run

# Ejecutar tests
mvn test
```

### Base de Datos
```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar script de setup
mysql -u root -p -e "source database_setup.sql"
```

### Pruebas de API
```bash
# Probar endpoints
curl -X GET http://localhost:8080/api/clients
curl -X GET http://localhost:8080/api/projects
curl -X POST http://localhost:8080/api/projects -H "Content-Type: application/json" -d '{"name":"Test","clientId":1,"status":"PLANIFICACION","startDate":"2024-01-01","endDate":"2024-12-31","budget":10000}'
```

---

## ✅ Estado del Proyecto

### ✅ Completado
- [x] Configuración de base de datos
- [x] Endpoints REST del backend
- [x] Adaptación frontend a REST
- [x] Selección de clientes por nombre
- [x] Configuración CORS
- [x] Manejo de errores
- [x] Sistema de autenticación completo
- [x] Documentación completa

### 🔄 En Desarrollo
- [ ] Tests automatizados
- [ ] Despliegue en producción
- [ ] Monitoreo avanzado

### 📋 Próximos Pasos
1. Implementar tests unitarios
2. Configurar CI/CD
3. Optimizar rendimiento
4. Añadir más funcionalidades

---

## 🔐 Sistema de Autenticación

### Características Implementadas

#### 1. **Autenticación de Usuarios**
- **Login:** Autenticación con email y contraseña
- **Verificación:** Validación de tokens JWT
- **Logout:** Cierre de sesión seguro
- **Cambio de Contraseña:** Actualización segura de credenciales
- **Primer Login:** Detección de usuarios nuevos

#### 2. **Seguridad**
- **Tokens JWT:** Autenticación stateless
- **Verificación Automática:** Validación de tokens al cargar la app
- **Logout Remoto:** Invalidación de tokens en el backend
- **Headers de Autorización:** Inclusión automática en requests

#### 3. **Gestión de Estado**
- **Contexto React:** Estado global de autenticación
- **LocalStorage:** Persistencia de sesión
- **Verificación Periódica:** Validación automática de tokens
- **Limpieza Automática:** Eliminación de datos corruptos

### Implementación Frontend

#### AuthContext
```javascript
// src/contexts/AuthContext.jsx
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Verificación automática al cargar
  useEffect(() => {
    const verifyStoredAuth = async () => {
      const token = localStorage.getItem('codethics_token');
      if (token) {
        const isValid = await userService.verifyAuth(token);
        if (!isValid) logout();
      }
    };
    verifyStoredAuth();
  }, []);
};
```

#### UserService
```javascript
// src/services/userService.js
class UserService {
  async authenticate(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
  
  async verifyAuth(token) {
    const response = await fetch(`${this.baseURL}/auth/verify`, {
      method: 'GET',
      headers: { ...API_CONFIG.HEADERS, 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  }
  
  async logout(token) {
    return fetch(`${this.baseURL}/auth/logout`, {
      method: 'POST',
      headers: { ...API_CONFIG.HEADERS, 'Authorization': `Bearer ${token}` }
    });
  }
}
```

### Flujo de Autenticación

1. **Login:** Usuario ingresa credenciales → Backend valida → Retorna token JWT
2. **Verificación:** Frontend incluye token en headers → Backend valida token
3. **Sesión:** Token se almacena en localStorage → Context mantiene estado
4. **Logout:** Frontend envía logout al backend → Limpia localStorage

### Configuración de Seguridad

#### Headers de Autorización
```javascript
// Inclusión automática en requests
const config = {
  headers: {
    ...API_CONFIG.HEADERS,
    'Authorization': `Bearer ${token}`
  }
};
```

#### Verificación de Tokens
```javascript
// Verificación automática al cargar la app
const isValid = await userService.verifyAuth(token);
if (!isValid) {
  logout(); // Limpia datos corruptos
}
```

---

## 🚨 Solución de Problemas

### Error de CORS
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:8080/api/health

# Verificar configuración CORS
curl -H "Origin: http://localhost:3000" http://localhost:8080/api/clients
```

### Error de Conexión a Base de Datos
```bash
# Verificar MySQL
mysql -u root -p -e "SHOW DATABASES;"

# Verificar tablas
mysql -u root -p -e "USE consultoria; SHOW TABLES;"
```

### Error de Creación de Proyectos
```bash
# Verificar estructura de datos
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","clientId":1,"status":"PLANIFICACION","startDate":"2024-01-01","endDate":"2024-12-31","budget":10000}'
```

---

## 🔧 Sistemas Implementados

### Sistema de Gestión de Usuarios
- **CRUD Completo**: Crear, leer, actualizar y eliminar usuarios
- **Eliminación Híbrida**: Física (sin dependencias) y lógica (con foreign keys)
- **Dashboard de Estadísticas**: Métricas en tiempo real de usuarios
- **Filtros Avanzados**: Por estado (activo, inactivo, eliminado)
- **Restauración**: Capacidad de restaurar usuarios eliminados lógicamente

### Sistema de Autenticación
- **Login Tradicional**: Email y contraseña con JWT
- **Google OAuth 2.0**: Integración completa con Google
- **Registro Automático**: Auto-registro con Google OAuth
- **Roles de Usuario**: Admin y Client con permisos diferenciados
- **Persistencia Segura**: Tokens JWT con localStorage

### Sistema de Notificaciones
- **WebSockets**: Notificaciones en tiempo real
- **Tipos Múltiples**: Info, Success, Warning, Error
- **Persistencia**: Almacenamiento con estado leído/no leído
- **Reconexión Automática**: Sistema de reconexión inteligente
- **UI Integrada**: Badges, dropdowns y overlays

### Portal del Cliente
- **Dashboard Dedicado**: Interfaz específica para clientes
- **Gestión de Presupuestos**: Ver y gestionar presupuestos asignados
- **Tickets de Soporte**: Sistema de tickets integrado
- **Proyectos Asignados**: Vista de proyectos del cliente
- **Perfil y Configuración**: Gestión de información personal

---

## 🚀 Integración OpenAPI

### Especificación Completa
- **Archivo**: `openapi-spec.json`
- **Endpoints**: 50+ endpoints documentados
- **Esquemas**: DTOs completos con validación
- **Versión**: OpenAPI 3.0.1

### Cliente Automático
- **Generación Dinámica**: Métodos generados desde especificación
- **Validación**: Validación automática contra esquemas
- **Cache Inteligente**: Sistema de cache para requests GET
- **Error Handling**: Manejo robusto de errores HTTP

### Componente de Testing
- **Interfaz Visual**: Testing de endpoints desde el frontend
- **Tests Automáticos**: Suite de tests predefinidos
- **Tests Personalizados**: Posibilidad de probar cualquier endpoint
- **Logs Detallados**: Información completa de requests/responses

### Archivos Principales
```
├── openapi-spec.json                    # Especificación OpenAPI 3.0
├── src/utils/openapiClient.js          # Cliente generador automático
├── src/services/openapiService.js      # Servicio integrado
├── src/components/OpenAPITester.jsx    # Componente de testing
```

---

## 👥 Gestión de Usuarios

### Eliminación Híbrida
El sistema implementa una estrategia inteligente de eliminación:

#### Eliminación Física
- Se ejecuta cuando no hay dependencias (foreign keys)
- Elimina completamente el registro de la base de datos
- Respuesta: `{"deletionType": "physical", "message": "Usuario eliminado físicamente"}`

#### Eliminación Lógica (Fallback)
- Se ejecuta cuando hay foreign key constraints
- Marca el usuario como `status: "deleted"`
- Preserva la integridad referencial
- Respuesta: `{"deletionType": "logical", "reason": "foreign_key_constraint", "newStatus": "deleted"}`

### UI Diferenciada
- **Usuarios Activos**: Colores normales
- **Usuarios Eliminados**: Fondo rojo, texto tachado, badge "ELIMINADO"
- **Acciones Ocultas**: No se muestran botones de editar/eliminar para usuarios eliminados
- **Filtros**: Posibilidad de ver solo usuarios eliminados

### Dashboard de Estadísticas
```javascript
const stats = {
  totalUsers: 5,
  activeUsers: 3,
  deletedUsers: 2,
  logicalDeletions: 2,
  physicalDeletions: 0,
  deletionRate: "40%"
};
```

---

## 🔔 Sistema de Notificaciones

### Arquitectura WebSocket
```javascript
// Conexión WebSocket
ws://localhost:8080/ws/notifications/{userId}

// Reconexión automática con backoff
const reconnectDelay = Math.min(1000 * Math.pow(2, attempt), 30000);
```

### Tipos de Notificación
- **BUDGET_PENDING**: Nuevo presupuesto pendiente
- **BUDGET_APPROVED**: Presupuesto aprobado
- **BUDGET_REJECTED**: Presupuesto rechazado
- **TICKET_NEW**: Nuevo ticket de soporte
- **TICKET_UPDATED**: Ticket actualizado
- **SYSTEM**: Notificaciones del sistema

### Componentes UI
- **NotificationBadge**: Contador de notificaciones no leídas
- **NotificationDropdown**: Lista desplegable de notificaciones
- **NotificationToast**: Notificaciones temporales
- **NotificationModal**: Modal para notificaciones detalladas

### Corrección Error 400
**Problema**: `JSON parse error: Cannot deserialize value of type 'java.lang.String' from Object value`

**Solución**: Transformación automática de datos
```javascript
const backendNotificationData = {
  userId: parseInt(notificationData.targetUserId),
  title: String(notificationData.title || ''),
  message: String(notificationData.message || ''),
  type: String(notificationData.type || 'info'),
  isRead: false
};
```

---

## 🔐 Autenticación y Seguridad

### Google OAuth Setup
1. **Google Cloud Console**:
   - Crear proyecto
   - Habilitar Google+ API
   - Crear credenciales OAuth 2.0

2. **Configuración Frontend**:
   ```bash
   # .env
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
   ```

3. **Endpoints Backend**:
   - `POST /api/auth/google` - Login con Google
   - `POST /api/auth/google/register` - Registro con Google

### JWT Implementation
```javascript
// Token storage
localStorage.setItem('codethics_token', token);

// Authorization header
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Context de Autenticación
```javascript
// AuthContext.jsx
const AuthContext = createContext();

// Funciones principales
- login(credentials)
- loginWithGoogle(googleData)
- logout()
- isAuthenticated
- userType (admin/client)
```

---

## 🛠️ Troubleshooting

### Errores Comunes y Soluciones

#### Error 400 en Notificaciones
**Causa**: Formato de datos incorrecto
**Solución**: Transformación automática implementada en `notificationService.js`

#### Foreign Key Constraint en Eliminación
**Causa**: Intentar eliminar usuario con dependencias
**Solución**: Sistema de eliminación híbrida implementado

#### Error de Google OAuth
**Causa**: Client ID no configurado o dominio no autorizado
**Solución**: Configurar Google Cloud Console y .env

#### WebSocket Connection Failed
**Causa**: Backend WebSocket no disponible
**Solución**: Verificar que el backend esté ejecutándose con WebSocket habilitado

### Debugging
```javascript
// Logs detallados en consola
🔄 NotificationService: Creando notificación
🚀 NotificationService: Usando OpenAPI Service
📥 NotificationService: Respuesta recibida: 200
✅ NotificationService: Notificación creada
```

---

## 📞 Contacto y Soporte

Para soporte técnico o preguntas sobre el proyecto:
- **Email:** fullconnectivity@gmail.com
- **Desarrollador:** Fernando Noguera Rodriguez
- **Empresa:** CodeXCore - Consultoría IT

---

*Última actualización: Enero 2025 - Proyecto completamente funcional con todas las integraciones* 