# XperiencIA - Landing Page

Una landing page profesional y moderna para la consultora IT "XperiencIA", desarrollada con React y Tailwind CSS.

## 🚀 Características Principales

### Frontend & UI
- **Diseño Responsivo**: Optimizado para dispositivos móviles, tablets y desktop
- **Navegación Suave**: Scroll suave entre secciones con anclas internas
- **Componentes Modulares**: Arquitectura limpia y mantenible
- **UI Moderna**: Diseño atractivo con Tailwind CSS y efectos glassmorphism
- **SEO Optimizado**: Meta tags y estructura semántica
- **Multilenguaje**: Soporte completo para Español e Inglés con selector de idioma
- **Fondo Tecnológico Global**: Animación interactiva con partículas y efectos visuales

### Sistema de Autenticación
- **Login Tradicional**: Autenticación con email y contraseña
- **Google OAuth**: Integración completa con Google OAuth 2.0
- **JWT Tokens**: Autenticación segura con tokens JWT
- **Roles de Usuario**: Sistema de roles (admin/client) con permisos diferenciados

### Gestión Empresarial
- **Panel de Administración**: Dashboard completo para gestión de proyectos y clientes
- **Gestión de Proyectos**: Sistema CRUD completo con estadísticas, filtros y seguimiento
- **Gestión de Clientes**: CRM básico con filtros avanzados y seguimiento
- **Gestión de Usuarios**: Sistema completo con eliminación híbrida (física/lógica)
- **Sistema de Presupuestos**: Creación, gestión y seguimiento de presupuestos
- **Sistema de Notificaciones**: Notificaciones en tiempo real con WebSockets
- **Portal del Cliente**: Interfaz dedicada para clientes con acceso a sus proyectos

### Integración API
- **OpenAPI 3.0**: Especificación completa con 50+ endpoints documentados
- **Cliente Automático**: Generación dinámica de métodos desde especificación OpenAPI
- **Validación de Datos**: Validación automática basada en esquemas
- **Testing Visual**: Componente de testing integrado para probar endpoints
- **Cache Inteligente**: Sistema de cache para optimización de requests

## 📋 Secciones

1. **Inicio**: Hero section con estadísticas y llamadas a la acción
2. **Servicios**: 12 servicios principales con precios y descripciones detalladas
3. **Casos de Éxito**: 3 proyectos destacados con resultados
4. **Contacto**: Formulario de contacto con Calendly y email
5. **Footer**: Información de copyright y enlaces rápidos

## 🛠️ Servicios Ofrecidos

### **Desarrollo y Tecnología**
- **Desarrollo Web** - Desde 3.500 €
- **Aplicaciones Móviles** - Desde 8.000 €
- **APIs y Microservicios** - Desde 5.500 €

### **Consultoría y Estrategia**
- **Consultoría IT** - Desde 120 €/hora
- **Cloud & DevOps** - Desde 2.500 €
- **Integración de Sistemas** - Desde 7.500 €

### **Análisis e Inteligencia**
- **Inteligencia Artificial** - Desde 15.000 €
- **Análisis de Datos y BI** - Desde 8.500 €
- **Automatización de Procesos** - Desde 4.500 €

### **Marketing y Comercio**
- **E-commerce** - Desde 6.500 €
- **Marketing en RRSS** - Desde 1.200 €/mes

### **Seguridad**
- **Ciberseguridad** - Desde 5.000 €

## 🛠️ Tecnologías Utilizadas

- **React 18**: Framework de JavaScript
- **Tailwind CSS**: Framework de CSS utility-first
- **PostCSS**: Procesador de CSS
- **Autoprefixer**: Compatibilidad con navegadores
- **React Context**: Gestión de estado para internacionalización
- **HTML5 Canvas**: Para efectos visuales y animaciones

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd consultoria
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── Navbar.jsx                    # Barra de navegación
│   ├── Home.jsx                      # Sección de inicio
│   ├── Services.jsx                  # Sección de servicios
│   ├── SuccessCases.jsx              # Casos de éxito
│   ├── Contact.jsx                   # Sección de contacto
│   ├── Footer.jsx                    # Pie de página
│   ├── LanguageSelector.jsx          # Selector de idioma
│   ├── TechBackground.jsx            # Fondo tecnológico animado
│   ├── Login.jsx                     # Componente de login para empleados
│   ├── Dashboard.jsx                 # Panel de administración
│   ├── ServicesDropdown.jsx          # Dropdown de servicios en navbar
│   └── admin/                        # Componentes de administración
│       ├── ProjectManagement.jsx     # Gestión de proyectos
│       └── ClientManagement.jsx      # Gestión de clientes
│   └── services/                     # Páginas individuales de servicios
│       ├── DesarrolloWeb.jsx
│       ├── AplicacionesMoviles.jsx
│       ├── ConsultoriaIT.jsx
│       ├── CloudDevOps.jsx
│       ├── InteligenciaArtificial.jsx
│       ├── Ciberseguridad.jsx
│       ├── Ecommerce.jsx
│       ├── MarketingRRSS.jsx
│       ├── AutomatizacionProcesos.jsx
│       ├── AnalisisDatos.jsx
│       ├── IntegracionSistemas.jsx
│       └── APIsMicroservicios.jsx
├── contexts/
│   ├── LanguageContext.jsx           # Contexto para gestión de idiomas
│   └── AuthContext.jsx               # Contexto para gestión de autenticación
├── hooks/
│   └── useTranslations.js            # Hook personalizado para traducciones
├── translations/
│   └── translations.js               # Archivo de traducciones
├── App.jsx                           # Componente principal con routing
├── index.js                         # Punto de entrada
└── index.css                        # Estilos globales
```

## 🎨 Personalización

### Colores
Los colores principales se pueden modificar en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
}
```

### Contenido
- **Servicios**: Edita el array `services` en `Services.jsx`
- **Casos de Éxito**: Modifica el array `cases` en `SuccessCases.jsx`
- **Información de Contacto**: Actualiza en `Contact.jsx`
- **Páginas de Servicios**: Personaliza cada servicio en `src/components/services/`

### Idiomas
- **Traducciones**: Modifica el archivo `src/translations/translations.js`
- **Nuevos idiomas**: Agrega nuevas claves de idioma en el archivo de traducciones
- **Selector de idioma**: Personaliza en `src/components/LanguageSelector.jsx`

### Efectos Visuales
- **Fondo tecnológico global**: Personaliza en `src/components/TechBackground.jsx`
- **Partículas**: Ajusta cantidad, velocidad y efectos de las partículas
- **Interacción**: Modifica la respuesta al movimiento del mouse
- **Colores**: Cambia la paleta de colores tecnológicos
- **Glassmorphism**: Efectos de cristal translúcido en todos los componentes

## 📱 Responsive Design

La landing page está optimizada para:
- **Móviles**: < 768px
- **Tablets**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Despliegue

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `build/`.

## 📄 Licencia

© XperiencIA 2025. Todos los derechos reservados.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🌍 Funcionalidad Multilenguaje

La landing page incluye soporte completo para múltiples idiomas:

- **Idiomas soportados**: Español (ES) e Inglés (EN)
- **Selector de idioma**: Dropdown en la barra de navegación con banderas
- **Persistencia**: La preferencia de idioma se guarda en localStorage
- **Traducciones completas**: Todo el contenido está traducido, incluyendo las 12 páginas de servicios
- **Fácil extensión**: Estructura modular para agregar nuevos idiomas

### Cómo agregar un nuevo idioma:

1. Agrega las traducciones en `src/translations/translations.js`
2. Actualiza el array de idiomas en `src/components/LanguageSelector.jsx`
3. El sistema automáticamente detectará y mostrará el nuevo idioma

## 🎨 Fondo Tecnológico Global

El sitio completo incluye un fondo tecnológico altamente interactivo que se extiende por todas las secciones:

- **Partículas dinámicas**: 120 partículas con diferentes tipos (datos y nodos)
- **Interacción con mouse**: Las partículas responden al movimiento del cursor
- **Efectos visuales**: Glow, pulse, conexiones dinámicas y líneas de escaneo
- **Elementos tecnológicos**: Símbolos flotantes, caracteres matrix y circuitos
- **Rendimiento optimizado**: Canvas HTML5 con requestAnimationFrame

### Características del fondo:

- **Sistema de partículas**: Partículas que se conectan y repelen
- **Efectos de iluminación**: Glow y sombras dinámicas
- **Animaciones fluidas**: Movimiento suave y responsivo
- **Interactividad**: Respuesta al movimiento del mouse
- **Elementos decorativos**: Símbolos tecnológicos y efectos matrix
- **Glassmorphism**: Todos los componentes usan efectos de cristal translúcido

## 🔗 Sistema de Navegación

### Navegación Principal
- **Home**: Navegación a la página principal
- **Servicios**: Scroll a la sección de servicios
- **Casos de Éxito**: Scroll a la sección de casos de éxito
- **Contacto**: Scroll a la sección de contacto

### Navegación de Servicios
- **12 páginas individuales**: Cada servicio tiene su propia página detallada
- **Navegación fluida**: Transiciones suaves entre páginas
- **Botón "Volver"**: Navegación de regreso a la página principal
- **Scroll automático**: Posicionamiento automático al top de cada página

### Características de Navegación
- **Estado persistente**: Mantiene la página actual durante la navegación
- **Responsive**: Funciona perfectamente en móviles y desktop
- **Accesibilidad**: Navegación por teclado y lectores de pantalla

## 📊 Páginas de Servicios

Cada servicio incluye:

### **Contenido Detallado**
- Descripción completa del servicio
- Características principales
- Tecnologías utilizadas
- Proceso de trabajo paso a paso
- Información de precios

### **Diseño Consistente**
- Gradientes azul-púrpura unificados
- Efectos glassmorphism
- Iconos específicos para cada servicio
- Layout responsivo de dos columnas

### **Funcionalidades**
- Traducción completa (ES/EN)

## 🚀 Panel de Gestión de Proyectos

### **Características Principales**
- **Dashboard completo**: Estadísticas en tiempo real de proyectos activos
- **CRUD de proyectos**: Crear, leer, actualizar y eliminar proyectos
- **Filtros avanzados**: Búsqueda por nombre/cliente y filtrado por estado
- **Gestión de presupuestos**: Seguimiento de presupuesto vs gastado
- **Estados de proyecto**: Planificación, En Progreso, En Revisión, Completado, Cancelado
- **Prioridades**: Baja, Media, Alta, Crítica con códigos de color
- **Progreso visual**: Barras de progreso con porcentajes
- **Interfaz responsiva**: Optimizada para móviles y desktop

### **Estadísticas del Dashboard**
- **Total de proyectos**: Contador general de proyectos
- **Proyectos en progreso**: Proyectos activos actualmente
- **Proyectos completados**: Proyectos finalizados exitosamente
- **Presupuesto total**: Suma de todos los presupuestos asignados
- **Gastado total**: Suma de todos los gastos realizados

### **Funcionalidades de Gestión**
- **Crear nuevo proyecto**: Formulario completo con validación
- **Editar proyectos**: Modificación de todos los campos
- **Eliminar proyectos**: Confirmación antes de eliminar
- **Búsqueda en tiempo real**: Filtrado instantáneo por texto
- **Filtros por estado**: Visualización por estado del proyecto
- **Ordenamiento**: Por fecha, presupuesto, prioridad, etc.

### **Campos del Proyecto**
- **Información básica**: Nombre, cliente, descripción
- **Fechas**: Fecha de inicio y fecha de fin
- **Presupuesto**: Presupuesto asignado y gastado
- **Estado**: Estado actual del proyecto
- **Prioridad**: Nivel de urgencia/importancia
- **Equipo**: Miembros asignados al proyecto
- **Progreso**: Porcentaje de completitud

### **Interfaz de Usuario**
- **Diseño glassmorphism**: Consistente con el resto del sitio
- **Tabla responsiva**: Visualización optimizada de proyectos
- **Modal de formulario**: Interfaz limpia para crear/editar
- **Iconos intuitivos**: Acciones claras y reconocibles
- **Colores semánticos**: Estados y prioridades con códigos de color
- **Animaciones suaves**: Transiciones y efectos hover

### **Integración con el Sistema**
- **Acceso desde Dashboard**: Navegación integrada desde el panel principal
- **Autenticación requerida**: Solo empleados autenticados pueden acceder
- **Persistencia de datos**: Los proyectos se mantienen durante la sesión
- **Multilenguaje**: Interfaz completamente traducida (ES/EN)
- **Navegación fluida**: Botones de retorno al dashboard principal

### **Datos de Ejemplo**
El sistema incluye proyectos de ejemplo para demostrar las funcionalidades:
- E-commerce TechRetail (En Progreso)
- App Móvil LogiTech (Completado)
- Sistema IA DataInsight (Planificación)
- Migración Cloud FinTech (En Revisión)

### **Tecnologías Utilizadas**
- **React Hooks**: useState para gestión de estado local
- **Componentes modulares**: Arquitectura limpia y mantenible
- **Tailwind CSS**: Estilos consistentes y responsivos
- **Sistema de traducciones**: Integración con el contexto de idiomas
- **Validación de formularios**: Validación en tiempo real
- **Gestión de modales**: Interfaz modal para formularios

## 👥 Panel de Gestión de Clientes

### **Características Principales**
- **Dashboard completo**: Estadísticas en tiempo real de clientes y prospectos
- **CRUD de clientes**: Crear, leer, actualizar y eliminar clientes
- **Filtros avanzados**: Búsqueda por nombre/contacto/empresa y filtrado por estado e industria
- **Gestión de contactos**: Información completa de personas de contacto
- **Estados de cliente**: Activo, Prospecto, Inactivo, Suspendido
- **Industrias**: Categorización por sector empresarial
- **Seguimiento de ingresos**: Control de ingresos totales por cliente
- **Historial de contactos**: Última fecha de contacto registrada
- **Interfaz responsiva**: Optimizada para móviles y desktop

### **Estadísticas del Dashboard**
- **Total de clientes**: Contador general de clientes
- **Clientes activos**: Clientes con proyectos en curso
- **Prospectos**: Clientes potenciales en fase de conversión
- **Clientes inactivos**: Clientes sin actividad reciente
- **Ingresos totales**: Suma de todos los ingresos generados
- **Total de proyectos**: Número total de proyectos por cliente

### **Funcionalidades de Gestión**
- **Crear nuevo cliente**: Formulario completo con validación
- **Editar clientes**: Modificación de todos los campos
- **Eliminar clientes**: Confirmación antes de eliminar
- **Búsqueda en tiempo real**: Filtrado instantáneo por texto
- **Filtros por estado**: Visualización por estado del cliente
- **Filtros por industria**: Visualización por sector empresarial
- **Ordenamiento**: Por fecha, ingresos, proyectos, etc.

### **Campos del Cliente**
- **Información básica**: Nombre del cliente y empresa
- **Contacto**: Persona de contacto, email, teléfono
- **Empresa**: Nombre de la empresa y sitio web
- **Industria**: Sector empresarial (Tecnología, E-commerce, etc.)
- **Estado**: Estado actual del cliente
- **Dirección**: Dirección física de la empresa
- **Notas**: Información adicional y comentarios
- **Métricas**: Número de proyectos e ingresos totales
- **Último contacto**: Fecha del último contacto registrado

### **Interfaz de Usuario**
- **Diseño glassmorphism**: Consistente con el resto del sitio
- **Tabla responsiva**: Visualización optimizada de clientes
- **Modal de formulario**: Interfaz limpia para crear/editar
- **Iconos intuitivos**: Acciones claras y reconocibles
- **Colores semánticos**: Estados con códigos de color
- **Animaciones suaves**: Transiciones y efectos hover

### **Integración con el Sistema**
- **Acceso desde Dashboard**: Navegación integrada desde el panel principal
- **Autenticación requerida**: Solo empleados autenticados pueden acceder
- **Persistencia de datos**: Los clientes se mantienen durante la sesión
- **Multilenguaje**: Interfaz completamente traducida (ES/EN)
- **Navegación fluida**: Botones de retorno al dashboard principal

### **Datos de Ejemplo**
El sistema incluye clientes de ejemplo para demostrar las funcionalidades:
- **TechRetail Solutions** (Activo, E-commerce, 3 proyectos, €45K)
- **LogiTech Express** (Activo, Logística, 2 proyectos, €28K)
- **DataInsight Corp** (Prospecto, Fintech, 0 proyectos, €0)
- **FinTech Solutions** (Activo, Fintech, 1 proyecto, €30K)
- **GreenEnergy Plus** (Inactivo, Energía, 1 proyecto, €15K)
- **HealthTech Innovations** (Prospecto, Salud, 0 proyectos, €0)

### **Industrias Soportadas**
- Tecnología, E-commerce, Logística, Fintech, Salud
- Energía, Educación, Manufactura, Retail, Servicios

### **Tecnologías Utilizadas**
- **React Hooks**: useState para gestión de estado local
- **Componentes modulares**: Arquitectura limpia y mantenible
- **Tailwind CSS**: Estilos consistentes y responsivos
- **Sistema de traducciones**: Integración con el contexto de idiomas
- **Validación de formularios**: Validación en tiempo real
- **Gestión de modales**: Interfaz modal para formularios
- **Filtros múltiples**: Combinación de filtros por estado e industria

## 🔐 Sistema de Autenticación

### **Características del Login**
- **Acceso exclusivo para empleados**: Sin zona de registro público
- **Credenciales de demo**:
  - Admin: `admin@xperiecia-consulting.com` / `admin123`
  - Cliente: `cliente@empresa.com` / `admin123`
- **Persistencia de sesión**: Login automático con localStorage
- **Interfaz moderna**: Diseño glassmorphism consistente con el sitio
- **Validación de formularios**: Mensajes de error en tiempo real
- **Estados de carga**: Indicadores visuales durante el proceso de login

### **Panel de Administración**
- **Dashboard completo**: Estadísticas y métricas de la empresa
- **Acciones rápidas**: Gestión de proyectos, clientes, reportes y configuración
- **Información del usuario**: Nombre y rol del empleado autenticado
- **Navegación intuitiva**: Botones para volver al sitio público
- **Logout seguro**: Cierre de sesión con limpieza de datos

### **Seguridad**
- **Contexto de autenticación**: Gestión centralizada del estado de usuario
- **Tokens JWT**: Simulación de autenticación con tokens
- **Protección de rutas**: Acceso condicional a funcionalidades
- **Persistencia segura**: Almacenamiento en localStorage con validación

### **Integración**
- **Navbar dinámico**: Muestra botón de login o menú de usuario según el estado
- **Navegación fluida**: Transiciones suaves entre login, dashboard y sitio público
- **Responsive**: Funciona perfectamente en móviles y desktop
- **Multilenguaje**: Todo el sistema de login está traducido (ES/EN)
- Navegación integrada
- Contraste optimizado para legibilidad
- Efectos hover y animaciones

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Frontend**: React 18, Tailwind CSS, HeadlessUI
- **Autenticación**: Google OAuth 2.0, JWT
- **Estado**: Context API, Local Storage
- **Networking**: Fetch API, OpenAPI Client
- **Build**: Create React App, PostCSS
- **Testing**: Componente visual integrado

### Estructura del Proyecto
```
consultoria/
├── 📁 src/
│   ├── 📁 components/           # Componentes React
│   │   ├── 📁 admin/           # Componentes del panel admin
│   │   ├── 📁 auth/            # Componentes de autenticación
│   │   ├── 📁 client/          # Componentes del portal cliente
│   │   ├── 📁 common/          # Componentes comunes/notificaciones
│   │   └── 📁 services/        # Páginas de servicios
│   ├── 📁 contexts/            # React Contexts (Auth, Language, Notifications)
│   ├── 📁 services/            # Servicios de API y lógica de negocio
│   ├── 📁 utils/               # Utilidades (OpenAPI Client, validaciones)
│   ├── 📁 config/              # Configuraciones (API, WhatsApp)
│   ├── 📁 constants/           # Constantes del proyecto
│   ├── 📁 hooks/               # Custom React Hooks
│   └── 📁 translations/        # Sistema de internacionalización
├── 📁 public/                  # Archivos estáticos
├── 📁 database/                # Scripts de base de datos
├── 📄 openapi-spec.json        # Especificación OpenAPI 3.0
└── 📚 Documentación/           # Guías y documentación técnica
```

### Características Técnicas Avanzadas

#### Eliminación Híbrida de Usuarios
- **Física**: Elimina completamente el registro si no hay dependencias
- **Lógica**: Marca como "deleted" si existen foreign key constraints
- **UI Inteligente**: Diferencia visual entre usuarios activos y eliminados
- **Restauración**: Capacidad de restaurar usuarios eliminados lógicamente

#### Sistema de Notificaciones
- **WebSockets**: Conexión en tiempo real para notificaciones instantáneas
- **Reconexión Automática**: Sistema de reconexión con backoff exponencial
- **Tipos de Notificación**: Info, Success, Warning, Error con colores diferenciados
- **Persistencia**: Almacenamiento en backend con estado leído/no leído

#### OpenAPI Integration
- **Generación Automática**: Métodos de API generados desde especificación
- **Validación en Tiempo Real**: Validación de datos contra esquemas OpenAPI
- **Testing Visual**: Interfaz gráfica para probar todos los endpoints
- **Fallback Inteligente**: Sistema tradicional como backup si OpenAPI falla

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 16+
- npm o yarn
- Backend Spring Boot ejecutándose en `localhost:8080`

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd consultoria

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu Google Client ID

# Iniciar en modo desarrollo
npm start
```

### Configuración de Google OAuth
1. Crear proyecto en Google Cloud Console
2. Habilitar Google+ API
3. Crear credenciales OAuth 2.0
4. Configurar dominios autorizados
5. Agregar REACT_APP_GOOGLE_CLIENT_ID al archivo .env

### Testing de API
- Acceder a `/openapi-tester` para testing visual
- Usar el componente OpenAPITester para probar endpoints
- Ejecutar `node test_openapi_integration.js` para tests automáticos

## 📞 Contacto

- **Email**: contacto@XperiencIA.com
- **Calendly**: [Agendar consulta gratuita](https://calendly.com/XperiencIA)

---

Desarrollado con ❤️ por el equipo de XperiencIA 