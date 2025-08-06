-- SQL Query para crear la tabla de proyectos
-- Base de datos: codethics
-- Tabla: proyectos

CREATE TABLE IF NOT EXISTS proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Nombre del proyecto',
    client_id INT NOT NULL COMMENT 'ID del cliente asociado',
    status ENUM('Planificación', 'En Progreso', 'Completado', 'Cancelado', 'Pausado') DEFAULT 'Planificación' COMMENT 'Estado del proyecto',
    progress INT DEFAULT 0 COMMENT 'Progreso del proyecto (0-100)',
    start_date DATE NOT NULL COMMENT 'Fecha de inicio del proyecto',
    end_date DATE NOT NULL COMMENT 'Fecha de finalización del proyecto',
    budget DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Presupuesto total del proyecto',
    spent DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Gasto actual del proyecto',
    priority ENUM('Baja', 'Media', 'Alta', 'Crítica') DEFAULT 'Media' COMMENT 'Prioridad del proyecto',
    description TEXT COMMENT 'Descripción detallada del proyecto',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    
    -- Índices para mejorar el rendimiento
    INDEX idx_client_id (client_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_start_date (start_date),
    INDEX idx_end_date (end_date),
    INDEX idx_created_at (created_at),
    
    -- Restricción de fechas
    CONSTRAINT chk_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_progress CHECK (progress >= 0 AND progress <= 100),
    CONSTRAINT chk_budget CHECK (budget >= 0),
    CONSTRAINT chk_spent CHECK (spent >= 0),
    
    -- Clave foránea al cliente
    FOREIGN KEY (client_id) REFERENCES clientes(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla de proyectos del sistema';

-- Insertar datos de ejemplo (opcional)
INSERT INTO proyectos (name, client_id, status, progress, start_date, end_date, budget, spent, priority, description) VALUES
('E-commerce TechRetail', 1, 'En Progreso', 75, '2024-01-15', '2024-04-15', 15000.00, 11250.00, 'Alta', 'Desarrollo de plataforma e-commerce completa'),
('App Móvil FinTech', 2, 'Planificación', 0, '2024-02-01', '2024-06-01', 25000.00, 0.00, 'Crítica', 'Aplicación móvil para servicios financieros'),
('Sistema de Analytics', 3, 'Completado', 100, '2023-11-01', '2024-01-31', 12000.00, 12000.00, 'Media', 'Sistema de análisis de datos y BI');

-- Nota: Asegúrate de que la tabla 'clientes' exista antes de ejecutar este script
-- Si no existe, crea primero la tabla de clientes con una estructura similar 