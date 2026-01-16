import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import {
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon as CheckIconSolid } from '@heroicons/react/20/solid';
import { serviceService } from '../../services/serviceService';
import { useAuth } from '../../contexts/AuthContext';

const ClientServices = () => {
  const { t } = useTranslations();
  const { user, clientId } = useAuth();

  // Estados para datos
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        const finalClientId = clientId || user?.id || 1;
        const data = await serviceService.getServicesByClient(finalClientId);
        setServices(data);
      } catch (err) {
        setError('Error al cargar los servicios');
        console.error('Error loading services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [user, clientId]);

  const statusOptions = [
    { value: 'all', label: t('client.allStatuses') },
    { value: 'scheduled', label: t('client.scheduled') },
    { value: 'in-progress', label: t('client.inProgress') },
    { value: 'completed', label: t('client.completed') },
    { value: 'cancelled', label: t('client.cancelled') }
  ];

  const sortOptions = [
    { value: 'date', label: t('client.date') },
    { value: 'amount', label: t('client.amount') },
    { value: 'status', label: t('client.status') },
    { value: 'title', label: t('client.title') }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'in-progress':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return t('client.scheduled');
      case 'in-progress':
        return t('client.inProgress');
      case 'completed':
        return t('client.completed');
      case 'cancelled':
        return t('client.cancelled');
      default:
        return status;
    }
  };

  const getInvoiceStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'overdue':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.startDate) - new Date(a.startDate);
        case 'amount':
          return b.amount - a.amount;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

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
              {t('client.services')}
            </h1>
            <p className="text-gray-400">
              {t('client.servicesSubtitle')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
              <CurrencyDollarIcon className="h-5 w-5 mr-2" />
              {t('client.viewInvoices')}
            </button>
            <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
              <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
              {t('client.requestService')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-400/10">
              <WrenchScrewdriverIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{t('client.totalServices')}</p>
              <p className="text-2xl font-bold text-white">{services.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-400/10">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{t('client.completed')}</p>
              <p className="text-2xl font-bold text-white">
                {services.filter(s => s.status === 'completed').length}
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
                {services.filter(s => s.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-400/10">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{t('client.totalSpent')}</p>
              <p className="text-2xl font-bold text-white">
                €{services.reduce((sum, s) => sum + (s.amount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('client.searchServices')}
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
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-600 text-white' : 'text-gray-300'
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

          {/* Sort */}
          <Listbox value={sortBy} onChange={setSortBy}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <span className="block truncate text-white">
                  {t('client.sortBy')}: {sortOptions.find(option => option.value === sortBy)?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {sortOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-600 text-white' : 'text-gray-300'
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
        </div>
      </div>

      {/* Services List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {t('client.servicesList')} ({filteredServices.length})
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <WrenchScrewdriverIcon className="h-8 w-8 text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-white">{service.title}</h4>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(service.status)}`}>
                            {getStatusText(service.status)}
                          </span>
                        </div>
                        <p className="text-gray-400 mt-1">{service.description}</p>
                        <div className="flex items-center space-x-6 mt-3 text-sm text-gray-400">
                          <span>ID: {service.id}</span>
                          <span>{t('client.startDate')}: {service.startDate}</span>
                          <span>{t('client.endDate')}: {service.endDate}</span>
                          <span className="text-primary-400 font-semibold">€{(service.amount || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-300 mb-2">{t('client.deliverables')}</h5>
                      <div className="flex flex-wrap gap-2">
                        {service.deliverables.map((deliverable, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-600 text-gray-300">
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Invoice Status */}
                    {service.invoice && (
                      <div className="mt-4 flex items-center space-x-4">
                        <span className="text-sm text-gray-400">{t('client.invoice')}: {service.invoice}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getInvoiceStatusColor(service.invoiceStatus)}`}>
                          {service.invoiceStatus === 'paid' ? t('client.paid') :
                            service.invoiceStatus === 'pending' ? t('client.pending') :
                              service.invoiceStatus === 'overdue' ? t('client.overdue') : service.invoiceStatus}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:ml-6">
                    <button className="flex items-center justify-center px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      {t('client.viewDetails')}
                    </button>
                    {service.invoice && (
                      <button className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        {t('client.downloadInvoice')}
                      </button>
                    )}
                    {service.status === 'completed' && (
                      <button className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        {t('client.downloadDeliverables')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-400">{t('client.noServicesFound')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('client.tryAdjustingFilters')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientServices; 