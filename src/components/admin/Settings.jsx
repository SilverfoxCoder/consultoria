import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { Tab } from '@headlessui/react';
import { Listbox } from '@headlessui/react';
import {
  UserCircleIcon, Cog6ToothIcon, UsersIcon, LinkIcon, ShieldCheckIcon, BuildingOffice2Icon,
  BellIcon, ChartBarIcon, BeakerIcon
} from '@heroicons/react/24/outline';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import AdminNotifications from './AdminNotifications';
import AdminStats from './AdminStats';
import AdminTest from './AdminTest';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Settings = ({ defaultTab = 'profile' }) => {
  const { lang } = useTranslations();
  const { user: authUser } = useAuth();
  
  // Estados para datos
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
    language: lang,
    theme: 'auto',
    notifications: true
  });
  const [company, setCompany] = useState({
    name: 'CodexCore',
    logo: '',
    address: 'Calle Gran Vía 123, Madrid',
    phone: '+34 670 83 58 22',
    email: 'contacto@codexcore.com',
    taxId: 'B12345678',
    website: 'www.codexcore.com',
    social: {
      linkedin: '',
      twitter: '',
      facebook: ''
    }
  });
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active'); // Por defecto solo activos
  const [showDeleted, setShowDeleted] = useState(false);
  const [integrations, setIntegrations] = useState({
    whatsapp: '+34 670 83 58 22',
    calendly: 'https://calendly.com/codexcore',
    apiKey: 'sk-xxxxxxx',
    webhook: 'https://webhook.site/xxxxxx'
  });
  const [security, setSecurity] = useState({
    twoFA: false,
    lastLogin: '2024-04-10 09:32',
    sessions: 2
  });
  
  // Estado para controlar la pestaña seleccionada
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Establecer la pestaña por defecto basada en defaultTab
  useEffect(() => {
    if (defaultTab === 'notifications') {
      // La pestaña de notificaciones es la 7ma (índice 6)
      setSelectedTabIndex(6);
    } else {
      setSelectedTabIndex(0);
    }
  }, [defaultTab]);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        // Cargar datos del usuario actual
        const userData = await userService.getUserById(authUser?.id || 1);
        
        setUser({
          name: userData.name || '',
          email: userData.email || '',
          avatar: userData.avatar || '',
          language: userData.language || lang,
          theme: userData.theme || 'auto',
          notifications: userData.notifications !== undefined ? userData.notifications : true
        });

        // Cargar todos los usuarios para la tabla
        try {
          const allUsers = await userService.getAllUsers();
          console.log('📋 Settings: Usuarios cargados:', allUsers);
          
          // Mapear los datos de la BD al formato del componente
          const mappedUsers = allUsers.map(dbUser => ({
            id: dbUser.id,
            name: dbUser.name || 'Sin nombre',
            email: dbUser.email || 'Sin email',
            role: mapRole(dbUser.role),
            active: dbUser.status === 'active',
            phone: dbUser.phone || '',
            registeredAt: dbUser.registered_at || ''
          }));
          
          setUsers(mappedUsers);
        } catch (usersError) {
          console.error('❌ Error al cargar usuarios:', usersError);
          // Mantener array vacío si falla la carga de usuarios
          setUsers([]);
        }
      } catch (err) {
        setError('Error al cargar la configuración');
        console.error('Error loading settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [authUser, lang]);

  // Función para mapear roles de la BD a roles mostrados
  const mapRole = (dbRole) => {
    const roleMap = {
      'admin': 'Administrador',
      'user': 'Usuario',
      'client': 'Cliente',
      'manager': 'Gestor'
    };
    return roleMap[dbRole] || dbRole || 'Usuario';
  };



  // Función para cambiar estado de usuario (activar/desactivar)
  const handleToggleUserStatus = async (user) => {
    const newStatus = !user.active;
    const action = newStatus ? 'activar' : 'desactivar';
    
    if (window.confirm(`¿Estás seguro de que quieres ${action} a ${user.name}?`)) {
      try {
        console.log(`🔄 ${newStatus ? 'Activando' : 'Desactivando'} usuario:`, user.id);
        
        // Llamar a la API para actualizar el estado en la base de datos
        await userService.updateUserStatus(user.id, newStatus ? 'active' : 'inactive');
        
        // Solo actualizar localmente SI la API respondió exitosamente
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === user.id ? { ...u, active: newStatus } : u
          )
        );
        
        console.log(`✅ Usuario ${user.name} ${newStatus ? 'activado' : 'desactivado'} exitosamente`);
      } catch (error) {
        console.error('❌ Error al cambiar estado del usuario:', error);
        alert(`Error al ${action} usuario: ${error.message}`);
      }
    }
  };

  // Función para eliminar usuario (eliminación lógica)
  const handleDeleteUser = async (user) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${user.name}? El usuario será desactivado permanentemente.`)) {
      console.log('🗑️ Iniciando proceso de eliminación para usuario:', user.id);
      
      try {
        // Primero intentar eliminación física
        console.log('🔍 Paso 1: Intentando eliminación física...');
        await userService.deleteUser(user.id);
        
        // ✅ Eliminación física exitosa
        console.log('✅ Eliminación física exitosa');
        setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
        alert(`Usuario ${user.name} eliminado exitosamente de la base de datos`);
        
      } catch (deleteError) {
        console.log('⚠️ Eliminación física falló, analizando error...');
        console.error('Error de eliminación física:', deleteError);
        
        // Verificar si es foreign key constraint
        const isForeignKeyError = deleteError.message.includes('foreign key constraint') || 
                                 deleteError.message.includes('constraint fails') ||
                                 deleteError.message.includes('cannot delete') ||
                                 deleteError.message.includes('Cannot delete or update a parent row');
        
        if (isForeignKeyError) {
          console.log('🎯 ¡CONFIRMADO! Error de foreign key constraint detectado');
          console.log('🔄 Aplicando eliminación lógica automáticamente...');
          
          try {
            // Aplicar eliminación lógica
            await userService.updateUserStatus(user.id, 'deleted');
            console.log('✅ Eliminación lógica aplicada exitosamente');
            
            // Actualizar en la UI para mostrar como eliminado
            setUsers(prevUsers => 
              prevUsers.map(u => 
                u.id === user.id 
                  ? { 
                      ...u, 
                      active: false, 
                      status: 'deleted', 
                      name: `${u.name} (Eliminado)`,
                      email: `${u.email} (Eliminado)`
                    }
                  : u
              )
            );
            
            alert(`Usuario ${user.name} desactivado exitosamente (eliminación lógica aplicada debido a registros asociados)`);
            console.log('✅ Proceso de eliminación lógica completado');
            
          } catch (logicalError) {
            console.error('❌ Error en eliminación lógica:', logicalError);
            alert(`Error al aplicar eliminación lógica: ${logicalError.message}`);
          }
          
        } else {
          // Si es otro tipo de error, mostrarlo
          console.error('❌ Error diferente (no foreign key constraint):', deleteError);
          alert(`Error al eliminar usuario: ${deleteError.message}`);
        }
      }
    }
  };

  // Filtrar usuarios según los criterios de búsqueda
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = user.active && user.status !== 'deleted';
    } else if (statusFilter === 'inactive') {
      matchesStatus = !user.active && user.status !== 'deleted';
    } else if (statusFilter === 'deleted') {
      matchesStatus = user.status === 'deleted';
    }
    // Si statusFilter === 'all', mostrar todos
    
    // Ocultar usuarios eliminados por defecto, a menos que se solicite explícitamente
    const shouldShow = showDeleted || user.status !== 'deleted';
    
    return matchesSearch && matchesRole && matchesStatus && shouldShow;
  });

  // Función para guardar usuario (crear o actualizar)
  const handleSaveUser = async (formData, existingUser) => {
    try {
      console.log('💾 Guardando usuario en la base de datos:', formData);
      
      if (existingUser) {
        // Actualizar usuario existente en la base de datos
        await userService.updateUser(existingUser.id, formData);
        
        // Solo actualizar localmente SI la actualización en la BD fue exitosa
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === existingUser.id 
              ? { 
                  ...u, 
                  ...formData, 
                  id: existingUser.id,
                  // Mantener campos que no se editan en el modal
                  registeredAt: u.registeredAt 
                }
              : u
          )
        );
        console.log('✅ Usuario actualizado exitosamente en la base de datos');
        alert(`Usuario ${formData.name} actualizado exitosamente`);
      } else {
        // Crear nuevo usuario en la base de datos
        const createdUser = await userService.createUser(formData);
        
        // Agregar el usuario creado con el ID real de la BD
        const newUser = {
          id: createdUser.id || Math.max(...users.map(u => u.id), 0) + 1,
          name: formData.name,
          email: formData.email,
          role: mapRole(createdUser.role || formData.role),
          active: formData.active,
          phone: formData.phone || '',
          registeredAt: createdUser.registered_at || new Date().toISOString()
        };
        
        setUsers(prevUsers => [...prevUsers, newUser]);
        console.log('✅ Usuario creado exitosamente en la base de datos');
        alert(`Usuario ${formData.name} creado exitosamente`);
      }
    } catch (error) {
      console.error('❌ Error al guardar usuario:', error);
      // Mostrar error específico al usuario
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        alert('Error: Ya existe un usuario con ese email');
      } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
        alert('Error: No tienes permisos para realizar esta acción');
      } else {
        alert(`Error al guardar usuario: ${error.message}`);
      }
      throw error;
    }
  };

  const languageOptions = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' }
  ];
  const themeOptions = [
    { value: 'auto', label: lang === 'es' ? 'Automático' : 'Auto' },
    { value: 'light', label: lang === 'es' ? 'Claro' : 'Light' },
    { value: 'dark', label: lang === 'es' ? 'Oscuro' : 'Dark' }
  ];

  const tabs = [
    {
      name: lang === 'es' ? 'Perfil' : 'Profile',
      icon: UserCircleIcon,
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl text-white">
              {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" /> : user.name[0]}
            </div>
            <div>
              <div className="text-lg font-bold text-white">{user.name}</div>
              <div className="text-gray-300">{user.email}</div>
            </div>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Nombre' : 'Name'}</label>
              <input type="text" value={user.name} onChange={e => setUser(u => ({ ...u, name: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
              <input type="email" value={user.email} onChange={e => setUser(u => ({ ...u, email: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Contraseña' : 'Password'}</label>
              <input type="password" value="********" disabled className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-400 focus:outline-none" />
              <button type="button" className="mt-2 text-blue-400 hover:underline text-sm">{lang === 'es' ? 'Cambiar contraseña' : 'Change password'}</button>
            </div>
          </form>
        </div>
      )
    },
    {
      name: lang === 'es' ? 'Preferencias' : 'Preferences',
      icon: Cog6ToothIcon,
      content: (
        <form className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Idioma' : 'Language'}</label>
            <Listbox value={user.language} onChange={val => setUser(u => ({ ...u, language: val }))}>
              <div className="relative">
                <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none text-left">
                  {languageOptions.find(opt => opt.value === user.language)?.label}
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                  {languageOptions.map(option => (
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
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Tema' : 'Theme'}</label>
            <Listbox value={user.theme} onChange={val => setUser(u => ({ ...u, theme: val }))}>
              <div className="relative">
                <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none text-left">
                  {themeOptions.find(opt => opt.value === user.theme)?.label}
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                  {themeOptions.map(option => (
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
          <div className="flex items-center">
            <input type="checkbox" checked={user.notifications} onChange={e => setUser(u => ({ ...u, notifications: e.target.checked }))} className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="ml-2 text-gray-200">{lang === 'es' ? 'Recibir notificaciones' : 'Receive notifications'}</span>
          </div>
        </form>
      )
    },
    {
      name: lang === 'es' ? 'Usuarios' : 'Users',
      icon: UsersIcon,
      content: (
        <div className="space-y-6">
          {/* Header con botón de agregar usuario */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-white">{lang === 'es' ? 'Gestión de Usuarios' : 'User Management'}</h3>
              <p className="text-gray-400 text-sm">{lang === 'es' ? 'Administra usuarios, roles y permisos' : 'Manage users, roles and permissions'}</p>
            </div>
            <button
              onClick={() => setShowUserModal(true)}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{lang === 'es' ? 'Nuevo Usuario' : 'New User'}</span>
            </button>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Buscar usuario' : 'Search user'}</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={lang === 'es' ? 'Buscar por nombre o email...' : 'Search by name or email...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Filtrar por rol' : 'Filter by role'}</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">{lang === 'es' ? 'Todos los roles' : 'All roles'}</option>
                  <option value="Administrador">{lang === 'es' ? 'Administradores' : 'Administrators'}</option>
                  <option value="Cliente">{lang === 'es' ? 'Clientes' : 'Clients'}</option>
                  <option value="Usuario">{lang === 'es' ? 'Usuarios' : 'Users'}</option>
                  <option value="Gestor">{lang === 'es' ? 'Gestores' : 'Managers'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Filtrar por estado' : 'Filter by status'}</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">{lang === 'es' ? 'Todos los estados' : 'All statuses'}</option>
                  <option value="active">{lang === 'es' ? 'Activos' : 'Active'}</option>
                  <option value="inactive">{lang === 'es' ? 'Inactivos' : 'Inactive'}</option>
                  <option value="deleted">{lang === 'es' ? 'Eliminados' : 'Deleted'}</option>
                </select>
              </div>
            </div>
            
            {/* Opción para mostrar usuarios eliminados */}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="showDeleted"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-white/20 rounded"
              />
              <label htmlFor="showDeleted" className="ml-2 text-sm text-gray-200">
                {lang === 'es' ? 'Mostrar usuarios eliminados' : 'Show deleted users'}
              </label>
            </div>
          </div>

          {/* Estadísticas de usuarios */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-200">{lang === 'es' ? 'Total' : 'Total'}</div>
                  <div className="text-2xl font-bold text-white">{filteredUsers.length}</div>
                </div>
                <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-200">{lang === 'es' ? 'Activos' : 'Active'}</div>
                  <div className="text-2xl font-bold text-white">{users.filter(u => u.active).length}</div>
                </div>
                <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-purple-200">{lang === 'es' ? 'Admins' : 'Admins'}</div>
                  <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'Administrador').length}</div>
                </div>
                <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg p-4 border border-orange-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-orange-200">{lang === 'es' ? 'Clientes' : 'Clients'}</div>
                  <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'Cliente').length}</div>
                </div>
                <div className="w-10 h-10 bg-orange-500/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{lang === 'es' ? 'Usuario' : 'User'}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{lang === 'es' ? 'Rol' : 'Role'}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{lang === 'es' ? 'Estado' : 'Status'}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{lang === 'es' ? 'Registro' : 'Registered'}</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">{lang === 'es' ? 'Acciones' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 divide-y divide-white/10">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <div className="text-gray-400">
                            {users.length === 0 
                              ? (lang === 'es' ? 'Cargando usuarios...' : 'Loading users...') 
                              : (lang === 'es' ? 'No se encontraron usuarios con estos filtros' : 'No users found with these filters')
                            }
                          </div>
                          {users.length > 0 && (
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setRoleFilter('all');
                                setStatusFilter('all');
                              }}
                              className="text-primary-400 hover:text-primary-300 text-sm"
                            >
                              {lang === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                    <tr key={u.id} className={classNames(
                      "transition-colors duration-200",
                      u.status === 'deleted' 
                        ? "bg-red-500/5 opacity-60 hover:bg-red-500/10" 
                        : "hover:bg-white/10"
                    )}>
                      <td className="px-4 py-4 text-sm text-gray-300 font-mono">#{u.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={classNames(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold",
                            u.status === 'deleted' 
                              ? "bg-gradient-to-br from-red-600 to-gray-600"
                              : "bg-gradient-to-br from-blue-500 to-purple-600"
                          )}>
                            {u.status === 'deleted' ? '✕' : (u.name ? u.name[0].toUpperCase() : '?')}
                          </div>
                          <div>
                            <div className={classNames(
                              "font-medium",
                              u.status === 'deleted' ? "text-red-300 line-through" : "text-white"
                            )}>
                              {u.name}
                              {u.status === 'deleted' && (
                                <span className="ml-2 text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded">
                                  {lang === 'es' ? 'ELIMINADO' : 'DELETED'}
                                </span>
                              )}
                            </div>
                            <div className="text-gray-400 text-sm">{u.phone || 'Sin teléfono'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={classNames(
                          "text-sm",
                          u.status === 'deleted' ? "text-gray-500 line-through" : "text-gray-300"
                        )}>
                          {u.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={classNames(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          u.status === 'deleted' 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : u.role === 'Administrador' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                              u.role === 'Cliente' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              u.role === 'Gestor' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                              'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        )}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={classNames(
                            'w-2 h-2 rounded-full mr-2',
                            u.status === 'deleted' ? 'bg-red-500' :
                            u.active ? 'bg-green-400' : 'bg-gray-400'
                          )}></div>
                          <span className={classNames(
                            'text-sm font-medium',
                            u.status === 'deleted' ? 'text-red-400' :
                            u.active ? 'text-green-300' : 'text-gray-400'
                          )}>
                            {u.status === 'deleted' ? (lang === 'es' ? 'Eliminado' : 'Deleted') :
                             u.active ? (lang === 'es' ? 'Activo' : 'Active') : (lang === 'es' ? 'Inactivo' : 'Inactive')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {u.registeredAt ? new Date(u.registeredAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          {u.status !== 'deleted' ? (
                            <>
                              <button 
                                onClick={() => {
                                  setEditingUser(u);
                                  setShowUserModal(true);
                                }}
                                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                title={lang === 'es' ? 'Editar usuario' : 'Edit user'}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleToggleUserStatus(u)}
                                className={classNames(
                                  'p-2 rounded-lg transition-colors',
                                  u.active 
                                    ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                    : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                                )}
                                title={u.active ? (lang === 'es' ? 'Desactivar' : 'Deactivate') : (lang === 'es' ? 'Activar' : 'Activate')}
                              >
                                {u.active ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(u)}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                title={lang === 'es' ? 'Eliminar usuario' : 'Delete user'}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                              </svg>
                              <span className="text-xs">{lang === 'es' ? 'Sin acciones' : 'No actions'}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Información de resultados */}
            {filteredUsers.length > 0 && (
              <div className="bg-white/5 px-6 py-3 border-t border-white/10">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div>
                    {lang === 'es' 
                      ? `Mostrando ${filteredUsers.length} de ${users.length} usuarios`
                      : `Showing ${filteredUsers.length} of ${users.length} users`
                    }
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>{filteredUsers.filter(u => u.active).length} {lang === 'es' ? 'activos' : 'active'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>{filteredUsers.filter(u => !u.active).length} {lang === 'es' ? 'inactivos' : 'inactive'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      name: lang === 'es' ? 'Integraciones' : 'Integrations',
      icon: LinkIcon,
      content: (
        <form className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">WhatsApp</label>
            <input type="text" value={integrations.whatsapp} onChange={e => setIntegrations(i => ({ ...i, whatsapp: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Calendly</label>
            <input type="text" value={integrations.calendly} onChange={e => setIntegrations(i => ({ ...i, calendly: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">API Key</label>
            <input type="text" value={integrations.apiKey} onChange={e => setIntegrations(i => ({ ...i, apiKey: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Webhook</label>
            <input type="text" value={integrations.webhook} onChange={e => setIntegrations(i => ({ ...i, webhook: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
          </div>
        </form>
      )
    },
    {
      name: lang === 'es' ? 'Seguridad' : 'Security',
      icon: ShieldCheckIcon,
      content: (
        <form className="space-y-6 max-w-xl">
          <div className="flex items-center">
            <input type="checkbox" checked={security.twoFA} onChange={e => setSecurity(s => ({ ...s, twoFA: e.target.checked }))} className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="ml-2 text-gray-200">{lang === 'es' ? 'Doble factor de autenticación (2FA)' : 'Two-factor authentication (2FA)'}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Último acceso' : 'Last login'}</label>
            <input type="text" value={security.lastLogin} disabled className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Sesiones activas' : 'Active sessions'}</label>
            <input type="number" value={security.sessions} disabled className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-400 focus:outline-none" />
          </div>
        </form>
      )
    },
    {
      name: lang === 'es' ? 'Empresa' : 'Company',
      icon: BuildingOffice2Icon,
      content: (
        <form className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Nombre de la empresa' : 'Company name'}</label>
            <input type="text" value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Dirección' : 'Address'}</label>
            <input type="text" value={company.address} onChange={e => setCompany(c => ({ ...c, address: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Teléfono' : 'Phone'}</label>
            <input type="text" value={company.phone} onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
            <input type="text" value={company.email} onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'CIF/NIF' : 'Tax ID'}</label>
            <input type="text" value={company.taxId} onChange={e => setCompany(c => ({ ...c, taxId: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Website</label>
            <input type="text" value={company.website} onChange={e => setCompany(c => ({ ...c, website: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none" />
          </div>
        </form>
      )
    },
    {
      name: lang === 'es' ? 'Notificaciones Admin' : 'Admin Notifications',
      icon: BellIcon,
      content: <AdminNotifications />
    },
    {
      name: lang === 'es' ? 'Estadísticas' : 'Statistics',
      icon: ChartBarIcon,
      content: <AdminStats />
    },
    {
      name: lang === 'es' ? 'Pruebas' : 'Tests',
      icon: BeakerIcon,
      content: <AdminTest />
    }
  ];



  // Calcular estadísticas de eliminaciones
  const getDeletionStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.active && u.status !== 'deleted').length;
    const inactiveUsers = users.filter(u => !u.active && u.status !== 'deleted').length;
    const deletedUsers = users.filter(u => u.status === 'deleted').length;
    const logicalDeletions = deletedUsers; // Todos los eliminados son lógicos
    const physicalDeletions = 0; // Por ahora no hay eliminaciones físicas
    
    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      deleted: deletedUsers,
      logicalDeletions,
      physicalDeletions,
      deletionRate: totalUsers > 0 ? ((deletedUsers / totalUsers) * 100).toFixed(1) : 0
    };
  };

  const stats = getDeletionStats();

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
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">{lang === 'es' ? 'Configuración' : 'Settings'}</h1>
          <p className="text-gray-300 mt-1">{lang === 'es' ? 'Gestiona tu perfil, empresa, usuarios y preferencias.' : 'Manage your profile, company, users and preferences.'}</p>
        </div>
      </div>
      
      {/* Dashboard de Estadísticas de Eliminaciones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total de Usuarios */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  {lang === 'es' ? 'Total Usuarios' : 'Total Users'}
                </p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Usuarios Activos */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  {lang === 'es' ? 'Usuarios Activos' : 'Active Users'}
                </p>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Usuarios Eliminados */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">
                  {lang === 'es' ? 'Eliminados' : 'Deleted Users'}
                </p>
                <p className="text-3xl font-bold text-white">{stats.deleted}</p>
                <p className="text-red-200 text-xs">
                  {lang === 'es' ? `${stats.deletionRate}% del total` : `${stats.deletionRate}% of total`}
                </p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
          </div>

          {/* Eliminaciones Lógicas */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  {lang === 'es' ? 'Eliminaciones Lógicas' : 'Logical Deletions'}
                </p>
                <p className="text-3xl font-bold text-white">{stats.logicalDeletions}</p>
                <p className="text-purple-200 text-xs">
                  {lang === 'es' ? 'Preserva datos' : 'Data preserved'}
                </p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
          <Tab.List className="flex space-x-2 rounded-xl bg-white/10 p-2 mb-8">
            {tabs.map((tab, i) => (
              <Tab key={i} className={({ selected }) =>
                classNames(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium focus:outline-none transition',
                  selected ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow' : 'text-gray-300 hover:bg-white/20')
              }>
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {tabs.map((tab, i) => (
              <Tab.Panel key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg">
                {tab.name === (lang === 'es' ? 'Preferencias' : 'Preferences') ? (
                  <form className="space-y-6 max-w-xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Idioma' : 'Language'}</label>
                      <Listbox value={user.language} onChange={val => setUser(u => ({ ...u, language: val }))}>
                        <div className="relative">
                          <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none text-left">
                            {languageOptions.find(opt => opt.value === user.language)?.label}
                          </Listbox.Button>
                          <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                            {languageOptions.map(option => (
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
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">{lang === 'es' ? 'Tema' : 'Theme'}</label>
                      <Listbox value={user.theme} onChange={val => setUser(u => ({ ...u, theme: val }))}>
                        <div className="relative">
                          <Listbox.Button className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none text-left">
                            {themeOptions.find(opt => opt.value === user.theme)?.label}
                          </Listbox.Button>
                          <Listbox.Options className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                            {themeOptions.map(option => (
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
                    <div className="flex items-center">
                      <input type="checkbox" checked={user.notifications} onChange={e => setUser(u => ({ ...u, notifications: e.target.checked }))} className="form-checkbox h-5 w-5 text-blue-600" />
                      <span className="ml-2 text-gray-200">{lang === 'es' ? 'Recibir notificaciones' : 'Receive notifications'}</span>
                    </div>
                  </form>
                ) : tab.content}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Modal para crear/editar usuario */}
      {showUserModal && (
        <UserModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          user={editingUser}
          onSave={handleSaveUser}
          lang={lang}
        />
      )}
    </div>
  );
};

// Componente Modal para Usuario
const UserModal = ({ isOpen, onClose, user, onSave, lang }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Usuario',
    phone: '',
    password: '',
    confirmPassword: '',
    active: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Modo edición
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Usuario',
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
        active: user.active !== undefined ? user.active : true
      });
    } else {
      // Modo creación
      setFormData({
        name: '',
        email: '',
        role: 'Usuario',
        phone: '',
        password: '',
        confirmPassword: '',
        active: true
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = lang === 'es' ? 'El nombre es requerido' : 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = lang === 'es' ? 'El email es requerido' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = lang === 'es' ? 'Email inválido' : 'Invalid email';
    }

    if (!user) { // Solo validar contraseña en modo creación
      if (!formData.password) {
        newErrors.password = lang === 'es' ? 'La contraseña es requerida' : 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = lang === 'es' ? 'La contraseña debe tener al menos 6 caracteres' : 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(formData, user);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {user 
              ? (lang === 'es' ? 'Editar Usuario' : 'Edit User')
              : (lang === 'es' ? 'Nuevo Usuario' : 'New User')
            }
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {lang === 'es' ? 'Nombre completo *' : 'Full name *'}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.name ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder={lang === 'es' ? 'Nombre del usuario' : 'User name'}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.email ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="usuario@ejemplo.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {lang === 'es' ? 'Teléfono' : 'Phone'}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="+34 600 000 000"
              />
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {lang === 'es' ? 'Rol *' : 'Role *'}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Usuario">{lang === 'es' ? 'Usuario' : 'User'}</option>
                <option value="Cliente">{lang === 'es' ? 'Cliente' : 'Client'}</option>
                <option value="Gestor">{lang === 'es' ? 'Gestor' : 'Manager'}</option>
                <option value="Administrador">{lang === 'es' ? 'Administrador' : 'Administrator'}</option>
              </select>
            </div>

            {/* Contraseña (solo en modo creación) */}
            {!user && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    {lang === 'es' ? 'Contraseña *' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.password ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder={lang === 'es' ? 'Mínimo 6 caracteres' : 'Minimum 6 characters'}
                  />
                  {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    {lang === 'es' ? 'Confirmar contraseña *' : 'Confirm password *'}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder={lang === 'es' ? 'Repite la contraseña' : 'Repeat password'}
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </>
            )}
          </div>

          {/* Estado activo */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-white/20 rounded"
            />
            <label className="ml-2 text-sm text-gray-200">
              {lang === 'es' ? 'Usuario activo' : 'Active user'}
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {lang === 'es' ? 'Guardando...' : 'Saving...'}
                </div>
              ) : (
                user 
                  ? (lang === 'es' ? 'Actualizar' : 'Update')
                  : (lang === 'es' ? 'Crear Usuario' : 'Create User')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings; 