import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { 
  ExclamationTriangleIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon as CheckIconSolid } from '@heroicons/react/20/solid';
import { supportService } from '../../services/supportService';
import { useAuth } from '../../contexts/AuthContext';

const ClientSupport = () => {
  const { t } = useTranslations();
  const { user, clientId } = useAuth();
  
  // Estados para datos
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' o 'edit'
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'technical',
    attachments: []
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setIsLoading(true);
        const finalClientId = clientId || user?.id || 1;
        const data = await supportService.getTicketsByClient(finalClientId);
        setTickets(data);
      } catch (err) {
        setError('Error al cargar los tickets de soporte');
        console.error('Error loading tickets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTickets();
  }, [user]);

  const statusOptions = [
    { value: 'all', label: t('client.allStatuses') },
    { value: 'open', label: t('client.open') },
    { value: 'in-progress', label: t('client.inProgress') },
    { value: 'resolved', label: t('client.resolved') },
    { value: 'closed', label: t('client.closed') }
  ];

  const priorityOptions = [
    { value: 'all', label: t('client.allPriorities') },
    { value: 'low', label: t('client.low') },
    { value: 'medium', label: t('client.medium') },
    { value: 'high', label: t('client.high') },
    { value: 'urgent', label: t('client.urgent') }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'in-progress':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'resolved':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'closed':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return t('client.open');
      case 'in-progress':
        return t('client.inProgress');
      case 'resolved':
        return t('client.resolved');
      case 'closed':
        return t('client.closed');
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-400/10';
      case 'high':
        return 'text-orange-400 bg-orange-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'low':
        return 'text-green-400 bg-green-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'urgent':
        return t('client.urgent');
      case 'high':
        return t('client.high');
      case 'medium':
        return t('client.medium');
      case 'low':
        return t('client.low');
      default:
        return priority;
    }
  };

  const filteredTickets = tickets
    .filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  // Funciones CRUD
  const handleCreateTicket = () => {
    setModalType('add');
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'technical',
      attachments: []
    });
    setShowTicketModal(true);
  };

  const handleEditTicket = (ticket) => {
    setModalType('edit');
    setSelectedTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      category: ticket.category,
      attachments: ticket.attachments || []
    });
    setShowTicketModal(true);
  };

  const handleSaveTicket = async () => {
    try {
      setIsLoading(true);
      
      const finalClientId = clientId || user?.id || 1;
      const ticketData = {
        ...formData,
        clientId: finalClientId,
        status: 'open'
      };
      
      if (modalType === 'add') {
        // Crear nuevo ticket
        const newTicket = await supportService.createTicket(ticketData);
        setTickets([newTicket, ...tickets]);
      } else {
        // Actualizar ticket existente
        const updatedTicket = await supportService.updateTicket(selectedTicket.id, ticketData);
        const updatedTickets = tickets.map(t => 
          t.id === selectedTicket.id ? updatedTicket : t
        );
        setTickets(updatedTickets);
      }
      
      setShowTicketModal(false);
      setSelectedTicket(null);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'technical',
        attachments: []
      });
    } catch (err) {
      setError('Error al guardar el ticket');
      console.error('Error saving ticket:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
      try {
        setIsLoading(true);
        await supportService.deleteTicket(ticketId);
        setTickets(tickets.filter(t => t.id !== ticketId));
      } catch (err) {
        setError('Error al eliminar el ticket');
        console.error('Error deleting ticket:', err);
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

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {t('client.support')}
            </h1>
            <p className="text-gray-400">
              {t('client.supportSubtitle')}
            </p>
          </div>
          <button 
            onClick={handleCreateTicket}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('client.createTicket')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-400/10">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{t('client.openTickets')}</p>
              <p className="text-2xl font-bold text-white">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-400/10">
              <ClockIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{t('client.inProgress')}</p>
              <p className="text-2xl font-bold text-white">
                {tickets.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-400/10">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{t('client.resolved')}</p>
              <p className="text-2xl font-bold text-white">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-400/10">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{t('client.totalTickets')}</p>
              <p className="text-2xl font-bold text-white">{tickets.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('client.searchTickets')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <Listbox value={statusFilter} onChange={setStatusFilter}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <span className="block truncate text-white">
                  {statusOptions.find(option => option.value === statusFilter)?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {statusOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-primary-600 text-white' : 'text-gray-300'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-400">
                            <CheckIconSolid className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>

          {/* Priority Filter */}
          <Listbox value={priorityFilter} onChange={setPriorityFilter}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <span className="block truncate text-white">
                  {priorityOptions.find(option => option.value === priorityFilter)?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {priorityOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-primary-600 text-white' : 'text-gray-300'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-400">
                            <CheckIconSolid className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              {t('client.liveChat')}
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {t('client.ticketsList')} ({filteredTickets.length})
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-8 w-8 text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-white">{ticket.title}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                              {getPriorityText(ticket.priority)}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                              {getStatusText(ticket.status)}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-400 mt-1">{ticket.description}</p>
                        <div className="flex items-center space-x-6 mt-3 text-sm text-gray-400">
                          <span>ID: {ticket.id}</span>
                          <span>{t('client.created')}: {ticket.createdAt}</span>
                          <span>{t('client.updated')}: {ticket.updatedAt}</span>
                          <span>{t('client.assignedTo')}: {ticket.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Latest Message Preview */}
                    {ticket.messages.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-600/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">
                            {t('client.latestMessage')}
                          </span>
                          <span className="text-xs text-gray-400">
                            {ticket.messages[ticket.messages.length - 1].timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">
                          {ticket.messages[ticket.messages.length - 1].message.substring(0, 150)}
                          {ticket.messages[ticket.messages.length - 1].message.length > 150 && '...'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:ml-6">
                    <button className="flex items-center justify-center px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      {t('client.viewDetails')}
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                      {t('client.reply')}
                    </button>
                    {ticket.status === 'resolved' && (
                      <button className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors">
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        {t('client.reopen')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-400">{t('client.noTicketsFound')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('client.tryAdjustingFilters')}</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowNewTicket(false)} />
            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">{t('client.createNewTicket')}</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('client.subject')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('client.ticketSubject')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('client.description')}
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('client.ticketDescription')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('client.priority')}
                    </label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="low">{t('client.low')}</option>
                      <option value="medium">{t('client.medium')}</option>
                      <option value="high">{t('client.high')}</option>
                      <option value="urgent">{t('client.urgent')}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-700/30 flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewTicket(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  {t('client.cancel')}
                </button>
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                  {t('client.createTicket')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSupport; 