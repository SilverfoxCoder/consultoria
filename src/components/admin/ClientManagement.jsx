import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { Listbox } from '@headlessui/react';
import { clientService } from '../../services/clientService';
import { projectService } from '../../services/projectService';

const ClientManagement = () => {
  const { t } = useTranslations();

  // Estados para gestión de clientes
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' o 'edit'
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterIndustry, setFilterIndustry] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar clientes y proyectos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Cargar clientes y proyectos en paralelo
        const [clientsData, projectsData] = await Promise.all([
          clientService.getAllClients(),
          projectService.getAllProjects()
        ]);

        setClients(clientsData);
        setProjects(projectsData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: '', // Contact Name / User Name
    company: '', // Client Name
    email: '',
    phone: '',
    industry: 'Tecnología',
    status: 'Prospecto',
    address: '',
    website: '',
    notes: '',
    assignedProjectId: null,
    lastContact: ''
  });

  // Helper para formatear fecha a DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin contacto';
    // Si viene como YYYY-MM-DD
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }
    // Si es ISO u otro formato, intentar convertir
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Helper para colores de estado (case-insensitive)
  const getStatusColor = (status) => {
    const normalized = status?.toLowerCase() || '';
    if (normalized === 'activo') return 'bg-green-500';
    if (normalized === 'prospecto') return 'bg-blue-500';
    if (normalized === 'inactivo') return 'bg-gray-500';
    if (normalized === 'suspendido') return 'bg-red-500';
    return 'bg-gray-500';
  };

  // Industrias disponibles
  const industries = [
    'Tecnología', 'E-commerce', 'Logística', 'Fintech', 'Salud',
    'Energía', 'Educación', 'Manufactura', 'Retail', 'Servicios'
  ];

  // Filtrar clientes
  const filteredClients = clients.filter(client => {
    const matchesStatus = filterStatus === 'todos' || client.status?.toLowerCase() === filterStatus?.toLowerCase();
    const matchesIndustry = filterIndustry === 'todos' || client.industry?.toLowerCase() === filterIndustry?.toLowerCase();
    const matchesSearch = (client.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesIndustry && matchesSearch;
  });

  // Calcular estadísticas
  const stats = {
    total: clients.length,
    activos: clients.filter(c => c.status?.toLowerCase() === 'activo').length,
    prospectos: clients.filter(c => c.status?.toLowerCase() === 'prospecto').length,
    inactivos: clients.filter(c => c.status?.toLowerCase() === 'inactivo').length,
    revenueTotal: (() => {
      // Calcular ingresos totales basados en proyectos reales
      return projects.reduce((sum, p) => {
        const client = clients.find(c => c.id === p.clientId);
        if (client) {
          return sum + (p.budget || 0);
        }
        return sum;
      }, 0);
    })(),
    projectsTotal: projects.length // Total de proyectos reales
  };

  const handleAddClient = () => {
    setModalType('add');
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      industry: 'Tecnología',
      status: 'Prospecto',
      address: '',
      website: '',
      notes: '',
      assignedProjectId: null,
      lastContact: ''
    });
    setShowModal(true);
  };

  const handleEditClient = (client) => {
    setModalType('edit');
    setSelectedClient(client);

    // Encontrar el proyecto asignado al cliente
    const assignedProject = projects.find(p => p.clientId === client.id);

    setFormData({
      name: client.name || '',
      company: client.company || '',
      email: client.email || '',
      phone: client.phone || '',
      industry: client.industry || 'Tecnología',
      status: client.status || 'Prospecto',
      address: client.address || '',
      website: client.website || '',
      notes: client.notes || '',
      assignedProjectId: assignedProject ? assignedProject.id : null,
      lastContact: client.lastContact ? new Date(client.lastContact).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleSaveClient = async () => {
    try {
      setIsLoading(true);

      if (modalType === 'add') {
        // Validar campos requeridos
        if (!formData.name?.trim() || !formData.company?.trim() || !formData.email?.trim()) {
          setError('Por favor complete todos los campos obligatorios (Nombre, Empresa, Email)');
          setIsLoading(false);
          return;
        }

        // Crear nuevo cliente
        const newClient = await clientService.createClient(formData);
        setClients([...clients, newClient]);
      } else {
        // Actualizar cliente existente
        const updatedClient = await clientService.updateClient(selectedClient.id, formData);
        const updatedClients = clients.map(c =>
          c.id === selectedClient.id ? updatedClient : c
        );
        setClients(updatedClients);
      }

      setShowModal(false);
      setSelectedClient(null);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        industry: 'Tecnología',
        status: 'Prospecto',
        address: '',
        website: '',
        notes: '',
        assignedProjectId: null,
        lastContact: ''
      });
    } catch (err) {
      setError('Error al guardar el cliente');
      console.error('Error saving client:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm(t('clientManagement.modal.deleteConfirm'))) {
      try {
        setIsLoading(true);
        await clientService.deleteClient(clientId);
        setClients(clients.filter(c => c.id !== clientId));
      } catch (err) {
        setError('Error al eliminar el cliente');
        console.error('Error deleting client:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const statusOptions = [
    { value: 'Activo', label: t('clientManagement.statuses.active') },
    { value: 'Prospecto', label: t('clientManagement.statuses.prospect') },
    { value: 'Inactivo', label: t('clientManagement.statuses.inactive') },
    { value: 'Suspendido', label: t('clientManagement.statuses.suspended') },
  ];
  const industryOptions = industries.map(ind => ({ value: ind, label: ind }));
  const filterStatusOptions = [
    { value: 'todos', label: t('clientManagement.filters.allStatuses') },
    ...statusOptions
  ];
  const filterIndustryOptions = [
    { value: 'todos', label: t('clientManagement.filters.allIndustries') },
    ...industryOptions
  ];

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
    <div className="h-full flex flex-col relative z-10">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/20 flex-none">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{t('clientManagement.title')}</h1>
              <p className="text-gray-300 mt-1">{t('clientManagement.subtitle')}</p>
            </div>
            <button
              onClick={handleAddClient}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('clientManagement.newClient')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('clientManagement.stats.totalClients')}</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('clientManagement.stats.activeClients')}</p>
                  <p className="text-3xl font-bold text-white">{stats.activos}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('clientManagement.stats.prospects')}</p>
                  <p className="text-3xl font-bold text-white">{stats.prospectos}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('clientManagement.stats.inactiveClients')}</p>
                  <p className="text-3xl font-bold text-white">{stats.inactivos}</p>
                </div>
                <div className="w-12 h-12 bg-gray-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('clientManagement.stats.totalRevenue')}</p>
                  <p className="text-3xl font-bold text-white">€{(stats.revenueTotal || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('clientManagement.stats.totalProjects')}</p>
                  <p className="text-3xl font-bold text-white">{stats.projectsTotal}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8 relative z-10">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={t('clientManagement.filters.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <Listbox value={filterStatus} onChange={setFilterStatus}>
                  <div className="relative">
                    <Listbox.Button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left">
                      {filterStatusOptions.find(opt => opt.value === filterStatus)?.label}
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-[9999] mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                      {filterStatusOptions.map(option => (
                        <Listbox.Option
                          key={option.value}
                          value={option.value}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none relative py-2 pl-4 pr-4 ${active ? 'bg-gray-100 text-gray-800' : 'text-gray-800'
                            } ${selected ? 'font-semibold' : ''}`
                          }
                        >
                          {option.label}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
                <Listbox value={filterIndustry} onChange={setFilterIndustry}>
                  <div className="relative">
                    <Listbox.Button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left">
                      {filterIndustryOptions.find(opt => opt.value === filterIndustry)?.label}
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-[9999] mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                      {filterIndustryOptions.map(option => (
                        <Listbox.Option
                          key={option.value}
                          value={option.value}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none relative py-2 pl-4 pr-4 ${active ? 'bg-gray-100 text-gray-800' : 'text-gray-800'
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
            </div>
          </div>

          {/* Clients Table */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 relative z-0 mb-8">
            <div className="min-w-full inline-block align-middle">
              <table className="w-full">
                <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('clientManagement.table.client')}</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('clientManagement.table.contact')}</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('clientManagement.table.industry')}</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('clientManagement.table.status')}</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('clientManagement.table.projects')}</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('clientManagement.table.revenue')}</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('clientManagement.table.lastContact')}</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('clientManagement.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{client.company || 'Sin empresa'}</div>
                          <div className="text-sm text-gray-300">ID: {client.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-white">{client.name || 'Sin contacto'}</div>
                          <div className="text-sm text-gray-300">{client.email || 'Sin email'}</div>
                          <div className="text-sm text-gray-300">{client.phone || 'Sin teléfono'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{client.industry || 'Sin industria'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)} text-white`}>
                          {client.status || 'Sin estado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {(() => {
                          const clientProjects = projects.filter(p => p.clientId === client.id);
                          if (clientProjects.length === 0) {
                            return 'Sin proyectos';
                          }
                          return (
                            <div>
                              {clientProjects.map(project => (
                                <div key={project.id} className="mb-1">
                                  <span className="text-white">{project.name}</span>
                                  <span className="text-gray-400 ml-2">({project.status})</span>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        €{(() => {
                          const clientProjects = projects.filter(p => p.clientId === client.id);
                          return clientProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
                        })().toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{formatDate(client.lastContact)}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClient(client)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
      {/* Modal para agregar/editar cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {modalType === 'add' ? t('clientManagement.modal.newClient') : t('clientManagement.modal.editClient')}
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('clientManagement.modal.contactPerson')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('clientManagement.modal.company')}</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('clientManagement.modal.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('clientManagement.modal.phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('clientManagement.modal.industry')}</label>
                  <Listbox value={formData.industry} onChange={val => setFormData(prev => ({ ...prev, industry: val }))}>
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left">
                        {industryOptions.find(opt => opt.value === formData.industry)?.label}
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                        {industryOptions.map(option => (
                          <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none relative py-2 pl-4 pr-4 ${active ? 'bg-gray-100 text-gray-800' : 'text-gray-800'
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

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('clientManagement.modal.status')}</label>
                  <Listbox value={formData.status} onChange={val => setFormData(prev => ({ ...prev, status: val }))}>
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left">
                        {statusOptions.find(opt => opt.value === formData.status)?.label}
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                        {statusOptions.map(option => (
                          <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none relative py-2 pl-4 pr-4 ${active ? 'bg-gray-100 text-gray-800' : 'text-gray-800'
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

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">{t('clientManagement.modal.website')}</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">{t('clientManagement.modal.address')}</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Proyecto Asignado</label>
                <Listbox
                  value={formData.assignedProjectId}
                  onChange={val => setFormData(prev => ({ ...prev, assignedProjectId: val }))}
                >
                  <div className="relative">
                    <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-left">
                      {formData.assignedProjectId ?
                        projects.find(p => p.id === formData.assignedProjectId)?.name || 'Proyecto no encontrado' :
                        'Sin proyecto asignado'
                      }
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none max-h-60 overflow-auto">
                      <Listbox.Option
                        value={null}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-4 pr-4 ${active ? 'bg-gray-100 text-gray-800' : 'text-gray-800'
                          }`
                        }
                      >
                        Sin proyecto asignado
                      </Listbox.Option>
                      {projects.map(project => (
                        <Listbox.Option
                          key={project.id}
                          value={project.id}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none relative py-2 pl-4 pr-4 ${active ? 'bg-gray-100 text-gray-800' : 'text-gray-800'
                            } ${selected ? 'font-semibold' : ''}`
                          }
                        >
                          {project.name} - {project.status}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">{t('clientManagement.modal.notes')}</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">{t('clientManagement.table.lastContact')}</label>
                <input
                  type="date"
                  name="lastContact"
                  value={formData.lastContact || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
              >
                {t('clientManagement.modal.cancel')}
              </button>
              <button
                onClick={handleSaveClient}
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-medium transition-all duration-200"
              >
                {modalType === 'add' ? t('clientManagement.modal.createClient') : t('clientManagement.modal.saveChanges')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement; 