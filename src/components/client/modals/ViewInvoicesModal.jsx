import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../../hooks/useTranslations';
import {
  CurrencyDollarIcon,
  XMarkIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

import { invoiceService } from '../../../services/invoiceService';
import { useAuth } from '../../../contexts/AuthContext';

const ViewInvoicesModal = ({ isOpen, onClose }) => {
  const { t } = useTranslations();
  const { user, clientId } = useAuth();

  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    let isMounted = true;

    const loadInvoices = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        const finalClientId = clientId || user?.id || 1;
        const data = await invoiceService.getInvoicesByClient(finalClientId);
        if (isMounted) {
          setInvoices(data || []);
        }
      } catch (error) {
        console.error('Error loading invoices:', error);
        if (isMounted) {
          setInvoices([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInvoices();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const getStatusColor = (status) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Pagada';
      case 'pending':
        return 'Pendiente';
      case 'overdue':
        return 'Vencida';
      default:
        return status;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filterStatus === 'all') return true;
    return invoice.status === filterStatus;
  });

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  const handleDownload = (invoice) => {
    console.log('Descargando factura:', invoice.id);
    // Aquí se implementaría la descarga real
  };

  const handleView = (invoice) => {
    console.log('Viendo factura:', invoice.id);
    // Aquí se implementaría la vista previa
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {t('client.viewInvoices')}
              </h2>
              <p className="text-gray-400 text-sm">
                Gestiona y descarga tus facturas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-200">Filtrar por:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todas las facturas</option>
              <option value="paid">Pagadas</option>
              <option value="pending">Pendientes</option>
              <option value="overdue">Vencidas</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Total Facturas</p>
              <p className="text-2xl font-bold text-white">{filteredInvoices.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Monto Total</p>
              <p className="text-2xl font-bold text-white">€{totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Estado</p>
              <p className="text-lg font-medium text-white">
                {filterStatus === 'all' ? 'Todas' :
                  filterStatus === 'paid' ? 'Pagadas' :
                    filterStatus === 'pending' ? 'Pendientes' : 'Vencidas'}
              </p>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No hay facturas para mostrar</p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <DocumentTextIcon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {invoice.project}
                              </h3>
                              <p className="text-sm text-gray-400">{invoice.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-white">
                                €{invoice.amount.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-400">
                                {invoice.number}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 mt-2">
                            <span className="text-sm text-gray-400">
                              Fecha: {new Date(invoice.date).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-400">
                              Vencimiento: {new Date(invoice.dueDate).toLocaleDateString()}
                            </span>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                              {getStatusText(invoice.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleView(invoice)}
                        className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                        title="Ver factura"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDownload(invoice)}
                        className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                        title="Descargar factura"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors duration-200"
          >
            Cerrar
          </button>
          <button
            onClick={() => console.log('Exportar todas las facturas')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Exportar Todas</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoicesModal; 