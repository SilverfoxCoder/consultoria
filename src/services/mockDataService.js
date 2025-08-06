// Mock data service for testing when backend is not available
export const mockDataService = {
  // Mock projects data
  getMockProjects: () => [
    {
      id: 1,
      name: "E-commerce TechRetail",
      client: "TechRetail Solutions",
      status: "En Progreso",
      progress: 75,
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      budget: 15000,
      spent: 11250,
      priority: "Alta",
      description: "Desarrollo de plataforma e-commerce completa"
    },
    {
      id: 2,
      name: "App Móvil FinTech",
      client: "FinTech Solutions",
      status: "Planificación",
      progress: 0,
      startDate: "2024-02-01",
      endDate: "2024-06-01",
      budget: 25000,
      spent: 0,
      priority: "Crítica",
      description: "Aplicación móvil para servicios financieros"
    },
    {
      id: 3,
      name: "Sistema de Analytics",
      client: "DataCorp",
      status: "Completado",
      progress: 100,
      startDate: "2023-11-01",
      endDate: "2024-01-31",
      budget: 12000,
      spent: 12000,
      priority: "Media",
      description: "Sistema de análisis de datos y BI"
    }
  ],

  // Mock clients data
  getMockClients: () => [
    {
      id: 1,
      name: "TechRetail Solutions",
      contactPerson: "María García",
      email: "maria.garcia@techretail.com",
      phone: "+34 600 123 456",
      company: "TechRetail Solutions",
      industry: "E-commerce",
      status: "Activo",
      totalRevenue: 45000,
      totalProjects: 3
    },
    {
      id: 2,
      name: "FinTech Solutions",
      contactPerson: "Carlos López",
      email: "carlos.lopez@fintech.com",
      phone: "+34 600 789 012",
      company: "FinTech Solutions",
      industry: "Finanzas",
      status: "Activo",
      totalRevenue: 78000,
      totalProjects: 2
    },
    {
      id: 3,
      name: "DataCorp",
      contactPerson: "Ana Martínez",
      email: "ana.martinez@datacorp.com",
      phone: "+34 600 345 678",
      company: "DataCorp",
      industry: "Tecnología",
      status: "Activo",
      totalRevenue: 120000,
      totalProjects: 5
    }
  ],

  // Mock project creation
  createMockProject: (projectData) => {
    const newProject = {
      id: Date.now(), // Simple ID generation
      ...projectData,
      progress: 0,
      spent: 0,
      createdAt: new Date().toISOString()
    };
    return Promise.resolve(newProject);
  },

  // Mock project update
  updateMockProject: (id, projectData) => {
    const updatedProject = {
      id: parseInt(id),
      ...projectData,
      updatedAt: new Date().toISOString()
    };
    return Promise.resolve(updatedProject);
  },

  // Mock project deletion
  deleteMockProject: (id) => {
    return Promise.resolve({ success: true, message: "Project deleted successfully" });
  }
}; 