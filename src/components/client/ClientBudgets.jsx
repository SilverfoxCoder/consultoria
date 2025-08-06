import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon as CheckIconSolid } from '@heroicons/react/20/solid';
import budgetService from '../../services/budgetService';
import { useAuth } from '../../contexts/AuthContext';

const ClientBudgets = () => {
  const { t } = useTranslations();
  const { user } = useAuth();
  
  // Estados para datos
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await budgetService.getBudgetsByClient(user?.id || 1);
        // Asegurar que data es un array
        setBudgets(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Error al cargar los presupuestos');
        console.error('Error loading budgets:', err);
        setBudgets([]); // Asegurar que budgets es un array incluso en caso de error
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgets();
  }, [user]);

  const statusOptions = [
    { value: 'all', label: t('client.allStatuses') },
    { value: 'pending', label: t('client.pending') },
    { value: 'approved', label: t('client.approved') },
    { value: 'rejected', label: t('client.rejected') },
    { value: 'expired', label: t('client.expired') }
  ];

  const sortOptions = [
    { value: 'date', label: t('client.date') },
    { value: 'amount', label: t('client.amount') },
    { value: 'status', label: t('client.status') },
    { value: 'title', label: t('client.title') }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'approved':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'expired':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return t('client.pending');
      case 'approved':
        return t('client.approved');
      case 'rejected':
        return t('client.rejected');
      case 'expired':
        return t('client.expired');
      default:
        return status;
    }
  };

  const filteredBudgets = (Array.isArray(budgets) ? budgets : [])
    .filter(budget => {
      // Verificar que budget tenga las propiedades necesarias
      if (!budget || typeof budget !== 'object') return false;
      
      const title = budget.title || '';
      const description = budget.description || '';
      const id = budget.id || '';
      const status = budget.status || '';
      
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Verificar que a y b sean objetos válidos
      if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return 0;
      
      switch (sortBy) {
        case 'date':
          const dateA = new Date(a.date || 0);
          const dateB = new Date(b.date || 0);
          return dateB - dateA;
        case 'amount':
          const amountA = parseFloat(a.amount) || 0;
          const amountB = parseFloat(b.amount) || 0;
          return amountB - amountA;
        case 'status':
          const statusA = a.status || '';
          const statusB = b.status || '';
          return statusA.localeCompare(statusB);
        case 'title':
          const titleA = a.title || '';
          const titleB = b.title || '';
          return titleA.localeCompare(titleB);
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
              {t('client.budgets')}
            </h1>
            <p className="text-gray-400">
              {t('client.budgetsSubtitle')}
            </p>
          </div>
          <button className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('client.requestBudget')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('client.searchBudgets')}
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
              <Listbox.Options className="absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
              <Listbox.Options className="absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {sortOptions.map((option) => (
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
        </div>
      </div>

      {/* Budgets List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 relative z-0">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {t('client.budgetsList')} ({filteredBudgets.length})
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredBudgets.length > 0 &&
              filteredBudgets.map((budget) => {
                if (!budget || typeof budget !== 'object') return null;
                const budgetId = budget.id || 'unknown';
                const budgetTitle = budget.title || 'Sin título';
                const budgetDescription = budget.description || 'Sin descripción';
                const budgetStatus = budget.status || 'unknown';
                const budgetDate = budget.date || 'N/A';
                const budgetValidUntil = budget.validUntil || 'N/A';
                const budgetAmount = budget.amount || 0;
                return (
                  <div key={budgetId} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <DocumentTextIcon className="h-8 w-8 text-primary-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-semibold text-white">{budgetTitle}</h4>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(budgetStatus)}`}>{getStatusText(budgetStatus)}</span>
                            </div>
                            <p className="text-gray-400 mt-1">{budgetDescription}</p>
                            <div className="flex items-center space-x-6 mt-3 text-sm text-gray-400">
                              <span>ID: {budgetId}</span>
                              <span>{t('client.created')}: {budgetDate}</span>
                              <span>{t('client.validUntil')}: {budgetValidUntil}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-300 mb-2">{t('client.budgetBreakdown')}</h5>
                          <div className="space-y-2">
                            {(budget.items || []).map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-400">{item.name}</span>
                                <span className="text-white">€{(item.amount || 0).toLocaleString()}</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-600 pt-2 flex justify-between font-semibold">
                              <span className="text-white">{t('client.total')}</span>
                              <span className="text-primary-400">€{budgetAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:ml-6">
                        <button className="flex items-center justify-center px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                          <EyeIcon className="h-4 w-4 mr-2" />
                          {t('client.view')}
                        </button>
                        <button className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                          {t('client.download')}
                        </button>
                        {budgetStatus === 'pending' && (
                          <>
                            <button className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors">
                              <CheckIcon className="h-4 w-4 mr-2" />
                              {t('client.approve')}
                            </button>
                            <button className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
                              <XMarkIcon className="h-4 w-4 mr-2" />
                              {t('client.reject')}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            {/* Mensaje si no hay presupuestos */}
            {filteredBudgets.length === 0 && (
              <div className="text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-400">{t('client.noBudgetsFound')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('client.tryAdjustingFilters')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientBudgets; 