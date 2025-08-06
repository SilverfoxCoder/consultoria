import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { Listbox } from '@headlessui/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { projectService } from '../../services/projectService';
import { clientService } from '../../services/clientService';
import { supportService } from '../../services/supportService';

const COLORS = ['#3b82f6', '#a78bfa', '#f59e42', '#10b981', '#ef4444', '#6366f1', '#f472b6'];

const ReportsAnalytics = () => {
  const { t, lang, translations } = useTranslations();

  // Months array - moved inside component to access t function
  const months = [
    t('reportsAnalytics.months.jan'), t('reportsAnalytics.months.feb'), t('reportsAnalytics.months.mar'), 
    t('reportsAnalytics.months.apr'), t('reportsAnalytics.months.may'), t('reportsAnalytics.months.jun'), 
    t('reportsAnalytics.months.jul'), t('reportsAnalytics.months.aug'), t('reportsAnalytics.months.sep'), 
    t('reportsAnalytics.months.oct'), t('reportsAnalytics.months.nov'), t('reportsAnalytics.months.dec')
  ];

  // Estados para datos
  const [dateRange, setDateRange] = useState('12m');
  const [serviceFilter, setServiceFilter] = useState('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [supportTicketsData, setSupportTicketsData] = useState([]);

  const dateRangeOptions = [
    { value: '12m', label: t('reportsAnalytics.dateRanges.last12Months') },
    { value: '6m', label: t('reportsAnalytics.dateRanges.last6Months') },
    { value: '3m', label: t('reportsAnalytics.dateRanges.last3Months') },
    { value: '1m', label: t('reportsAnalytics.dateRanges.lastMonth') },
  ];
  const serviceOptions = [
    { value: 'todos', label: t('reportsAnalytics.serviceFilters.allServices') },
    { value: 'web', label: translations?.services?.services?.[0]?.title || 'Desarrollo Web' },
    { value: 'mobile', label: translations?.services?.services?.[1]?.title || 'Aplicaciones Móviles' },
    { value: 'consulting', label: translations?.services?.services?.[2]?.title || 'Consultoría IT' },
    { value: 'cloud', label: translations?.services?.services?.[3]?.title || 'Cloud & DevOps' },
    { value: 'ai', label: translations?.services?.services?.[4]?.title || 'Inteligencia Artificial' },
    { value: 'cyber', label: translations?.services?.services?.[5]?.title || 'Ciberseguridad' },
  ];

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Cargando datos del dashboard...');
        
        const [analytics, projects, clients, supportTickets] = await Promise.all([
          analyticsService.getAllAnalytics(),
          projectService.getAllProjects(),
          clientService.getAllClients(),
          supportService.getAllTickets()
        ]);
        
        console.log('📊 Datos cargados:', {
          analytics: analytics,
          projects: projects.length,
          clients: clients.length,
          supportTickets: supportTickets.length
        });
        
        setAnalyticsData(analytics);
        setProjectsData(projects);
        setClientsData(clients);
        setSupportTicketsData(supportTickets);
      } catch (err) {
        setError('Error al cargar los datos de analíticas');
        console.error('Error loading analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // KPIs con datos reales
  const kpis = [
    { 
      label: t('reportsAnalytics.monthlyRevenue'), 
      value: `€${(() => {
        // Calcular ingresos totales de todos los proyectos
        const totalRevenue = projectsData.reduce((sum, p) => sum + (p.budget || 0), 0);
        return totalRevenue.toLocaleString();
      })()}`, 
      icon: '💶', 
      color: 'from-blue-500 to-blue-700' 
    },
    { 
      label: t('reportsAnalytics.activeProjects'), 
      value: projectsData.filter(p => 
        p.status === 'EN_PROGRESO' || 
        p.status === 'PLANIFICACION' || 
        p.status === 'en_progress' || 
        p.status === 'active'
      ).length, 
      icon: '📁', 
      color: 'from-purple-500 to-purple-700' 
    },
    { 
      label: t('reportsAnalytics.newClients'), 
      value: (() => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        return clientsData.filter(c => {
          let clientDate;
          if (c.createdAt) {
            clientDate = new Date(c.createdAt);
          } else if (c.joinDate) {
            clientDate = new Date(c.joinDate);
          } else if (c.lastContact) {
            clientDate = new Date(c.lastContact);
          } else {
            clientDate = new Date();
          }
          
          if (isNaN(clientDate.getTime())) {
            clientDate = new Date();
          }
          
          return clientDate >= lastMonth;
        }).length;
      })(), 
      icon: '🧑‍💼', 
      color: 'from-green-500 to-green-700' 
    },
    { 
      label: t('reportsAnalytics.supportTickets'), 
      value: supportTicketsData.filter(t => 
        t.status === 'open' || 
        t.status === 'in-progress' || 
        t.status === 'in_progress'
      ).length, 
      icon: '🎫', 
      color: 'from-pink-500 to-pink-700' 
    },
  ];

  // Datos reales para gráficas
  const revenueData = months.map((m, i) => {
    const monthAnalytics = analyticsData.monthlyData?.find(a => a.month === m) || {};
    
    // Calcular proyectos y clientes reales para este mes
    const currentMonth = new Date();
    const targetMonth = new Date(currentMonth.getFullYear(), i, 1);
    
    // Proyectos creados en este mes
    const monthProjects = projectsData.filter(p => {
      // Intentar diferentes campos de fecha para el proyecto
      let projectDate;
      if (p.createdAt) {
        projectDate = new Date(p.createdAt);
      } else if (p.startDate) {
        projectDate = new Date(p.startDate);
      } else if (p.updatedAt) {
        projectDate = new Date(p.updatedAt);
      } else {
        // Si no hay fecha, usar la fecha actual como fallback
        projectDate = new Date();
      }
      
      // Verificar que la fecha es válida
      if (isNaN(projectDate.getTime())) {
        projectDate = new Date();
      }
      
      return projectDate.getMonth() === targetMonth.getMonth() && 
             projectDate.getFullYear() === targetMonth.getFullYear();
    }).length;
    
    // Clientes creados en este mes
    const monthClients = clientsData.filter(c => {
      // Intentar diferentes campos de fecha para el cliente
      let clientDate;
      if (c.createdAt) {
        clientDate = new Date(c.createdAt);
      } else if (c.joinDate) {
        clientDate = new Date(c.joinDate);
      } else if (c.lastContact) {
        clientDate = new Date(c.lastContact);
      } else {
        // Si no hay fecha, usar la fecha actual como fallback
        clientDate = new Date();
      }
      
      // Verificar que la fecha es válida
      if (isNaN(clientDate.getTime())) {
        clientDate = new Date();
      }
      
      return clientDate.getMonth() === targetMonth.getMonth() && 
             clientDate.getFullYear() === targetMonth.getFullYear();
    }).length;
    
    // Calcular ingresos reales para este mes
    const monthRevenue = projectsData.filter(p => {
      let projectDate;
      if (p.createdAt) {
        projectDate = new Date(p.createdAt);
      } else if (p.startDate) {
        projectDate = new Date(p.startDate);
      } else if (p.updatedAt) {
        projectDate = new Date(p.updatedAt);
      } else {
        projectDate = new Date();
      }
      
      if (isNaN(projectDate.getTime())) {
        projectDate = new Date();
      }
      
      return projectDate.getMonth() === targetMonth.getMonth() && 
             projectDate.getFullYear() === targetMonth.getFullYear();
    }).reduce((sum, p) => sum + (p.budget || 0), 0);
    
    return {
      month: m,
      revenue: monthRevenue,
      projects: monthProjects,
      clients: monthClients
    };
  });

  // Proyectos por servicio (datos reales)
  const projectsByService = projectsData.reduce((acc, project) => {
    // Usar el tipo de servicio del proyecto o inferir del nombre/descripción
    let serviceType = project.serviceType;
    
    if (!serviceType) {
      // Inferir tipo de servicio basado en el nombre o descripción
      const name = (project.name || '').toLowerCase();
      const description = (project.description || '').toLowerCase();
      
      if (name.includes('web') || description.includes('web') || name.includes('sitio')) {
        serviceType = 'Desarrollo Web';
      } else if (name.includes('app') || name.includes('móvil') || name.includes('mobile')) {
        serviceType = 'Desarrollo Móvil';
      } else if (name.includes('consult') || description.includes('consult')) {
        serviceType = 'Consultoría IT';
      } else if (name.includes('cloud') || description.includes('cloud')) {
        serviceType = 'Servicios Cloud';
      } else if (name.includes('ai') || name.includes('inteligencia')) {
        serviceType = 'Inteligencia Artificial';
      } else if (name.includes('cyber') || name.includes('seguridad')) {
        serviceType = 'Ciberseguridad';
      } else {
        serviceType = 'Desarrollo Web'; // Por defecto
      }
    }
    
    acc[serviceType] = (acc[serviceType] || 0) + 1;
    return acc;
  }, {});

  const projectsByServiceArray = Object.entries(projectsByService).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value).slice(0, 6);

  // Top clientes (datos reales)
  const topClients = clientsData.map(client => {
    const clientProjects = projectsData.filter(p => p.clientId === client.id);
    const clientRevenue = clientProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
    return {
      name: client.name || client.company,
      revenue: clientRevenue,
      projects: clientProjects.length
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">{t('reportsAnalytics.title')}</h1>
          <p className="text-gray-300 mt-1">{t('reportsAnalytics.subtitle')}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, i) => (
            <div key={i} className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 flex items-center space-x-4 shadow-lg`}>
              <div className={`w-14 h-14 flex items-center justify-center rounded-xl text-3xl bg-gradient-to-br ${kpi.color} text-white shadow-md`}>{kpi.icon}</div>
              <div>
                <p className="text-gray-300 text-sm">{kpi.label}</p>
                <p className="text-2xl font-bold text-white">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <Listbox value={dateRange} onChange={setDateRange}>
            <div className="relative w-56">
              <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left">
                {dateRangeOptions.find(opt => opt.value === dateRange)?.label}
              </Listbox.Button>
              <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                {dateRangeOptions.map(option => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className={({ active, selected }) =>
                      `cursor-pointer select-none relative py-2 pl-4 pr-4 ${
                        active ? 'bg-gray-100 text-gray-800' : 'text-gray-800'
                      } ${selected ? 'font-semibold' : ''}`
                    }
                  >
                    {option.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          <Listbox value={serviceFilter} onChange={setServiceFilter}>
            <div className="relative w-56">
              <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left">
                {serviceOptions.find(opt => opt.value === serviceFilter)?.label}
              </Listbox.Button>
              <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                {serviceOptions.map(option => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className={({ active, selected }) =>
                      `cursor-pointer select-none relative py-2 pl-4 pr-4 ${
                        active ? 'bg-gray-100 text-gray-800' : 'text-gray-800'
                      } ${selected ? 'font-semibold' : ''}`
                    }
                  >
                    {option.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Ingresos mensuales */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-4">{t('reportsAnalytics.charts.monthlyRevenue')}</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                <XAxis dataKey="month" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip contentStyle={{ background: '#fff', color: '#222' }} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Proyectos por servicio */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-4">{t('reportsAnalytics.charts.projectsByService')}</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={projectsByServiceArray} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {projectsByServiceArray.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: '#fff', color: '#222' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Línea de proyectos y clientes */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg mb-12">
          <h2 className="text-lg font-bold text-white mb-4">{t('reportsAnalytics.charts.projectsAndClients')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
              <XAxis dataKey="month" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip contentStyle={{ background: '#fff', color: '#222' }} />
              <Line type="monotone" dataKey="projects" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="clients" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top clientes */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4">{t('reportsAnalytics.charts.topClients')}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('reportsAnalytics.table.client')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('reportsAnalytics.table.projects')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('reportsAnalytics.table.revenue')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {topClients.map((client, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 text-white font-medium">{client.name}</td>
                    <td className="px-6 py-4 text-gray-300">{client.projects}</td>
                    <td className="px-6 py-4 text-gray-300">€{(client.revenue || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics; 