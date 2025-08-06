import React, { useState, useEffect } from 'react';
import { initializeOpenAPIService, getOpenAPIService } from '../services/openapiService.js';

const OpenAPITester = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [serviceInfo, setServiceInfo] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const [endpointParams, setEndpointParams] = useState('');
  const [endpointData, setEndpointData] = useState('');

  useEffect(() => {
    initializeService();
  }, []);

  const initializeService = async () => {
    setLoading(true);
    try {
      const success = await initializeOpenAPIService();
      setIsInitialized(success);
      
      if (success) {
        const service = getOpenAPIService();
        setServiceInfo(service.getStats());
      }
    } catch (error) {
      console.error('Error inicializando OpenAPI Service:', error);
      setTestResults(prev => [...prev, {
        type: 'error',
        message: `Error de inicialización: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    try {
      const service = getOpenAPIService();
      const result = await testFunction(service);
      
      setTestResults(prev => [...prev, {
        type: 'success',
        testName,
        message: 'Test ejecutado exitosamente',
        data: result,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'error',
        testName,
        message: `Error en test: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (service) => {
    return await service.testConnection();
  };

  const testGetAllUsers = async (service) => {
    return await service.getAllUsers();
  };

  const testGetAllClients = async (service) => {
    return await service.getAllClients();
  };

  const testGetAllBudgets = async (service) => {
    return await service.getAllBudgets();
  };

  const testGetDashboardSummary = async (service) => {
    return await service.getDashboardSummary();
  };

  const testGetHealth = async (service) => {
    return await service.getHealth();
  };

  const executeCustomEndpoint = async () => {
    if (!selectedEndpoint) {
      alert('Por favor selecciona un endpoint');
      return;
    }

    setLoading(true);
    try {
      const service = getOpenAPIService();
      
      let params = {};
      let data = null;

      if (endpointParams) {
        try {
          params = JSON.parse(endpointParams);
        } catch (error) {
          throw new Error('Parámetros JSON inválidos');
        }
      }

      if (endpointData) {
        try {
          data = JSON.parse(endpointData);
        } catch (error) {
          throw new Error('Datos JSON inválidos');
        }
      }

      const result = await service.call(selectedEndpoint, params, data);
      
      setTestResults(prev => [...prev, {
        type: 'success',
        testName: `Custom: ${selectedEndpoint}`,
        message: 'Endpoint ejecutado exitosamente',
        data: result,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'error',
        testName: `Custom: ${selectedEndpoint}`,
        message: `Error ejecutando endpoint: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const formatData = (data) => {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  if (loading && !isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Inicializando OpenAPI Service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🚀 OpenAPI Integration Tester
          </h1>
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isInitialized 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isInitialized ? '✅ Inicializado' : '❌ No inicializado'}
            </div>
            {serviceInfo && (
              <div className="text-sm text-gray-600">
                {serviceInfo.totalEndpoints} endpoints disponibles
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📋 Información del Servicio
            </h2>
            {serviceInfo && (
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Estado:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    serviceInfo.loaded 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {serviceInfo.loaded ? 'Cargado' : 'No cargado'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Endpoints:</span>
                  <span className="ml-2 text-gray-600">{serviceInfo.totalEndpoints}</span>
                </div>
                {serviceInfo.serviceInfo && (
                  <div>
                    <span className="font-medium">Base URL:</span>
                    <span className="ml-2 text-gray-600">{serviceInfo.serviceInfo.baseUrl}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Tests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ⚡ Tests Rápidos
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => runTest('Conexión', testConnection)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Test Conexión
              </button>
              <button
                onClick={() => runTest('Usuarios', testGetAllUsers)}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Test Usuarios
              </button>
              <button
                onClick={() => runTest('Clientes', testGetAllClients)}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Test Clientes
              </button>
              <button
                onClick={() => runTest('Presupuestos', testGetAllBudgets)}
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
              >
                Test Presupuestos
              </button>
              <button
                onClick={() => runTest('Dashboard', testGetDashboardSummary)}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                Test Dashboard
              </button>
              <button
                onClick={() => runTest('Health', testGetHealth)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Test Health
              </button>
            </div>
          </div>
        </div>

        {/* Custom Endpoint Tester */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔧 Test de Endpoint Personalizado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endpoint
              </label>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar endpoint</option>
                {serviceInfo?.availableEndpoints?.map(endpoint => (
                  <option key={endpoint} value={endpoint}>
                    {endpoint}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parámetros (JSON)
              </label>
              <input
                type="text"
                value={endpointParams}
                onChange={(e) => setEndpointParams(e.target.value)}
                placeholder='{"id": 1}'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datos (JSON)
            </label>
            <textarea
              value={endpointData}
              onChange={(e) => setEndpointData(e.target.value)}
              placeholder='{"name": "test", "email": "test@example.com"}'
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={executeCustomEndpoint}
            disabled={loading || !selectedEndpoint}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Ejecutando...' : 'Ejecutar Endpoint'}
          </button>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              📊 Resultados de Tests
            </h2>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Limpiar
            </button>
          </div>
          
          {testResults.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay resultados de tests aún. Ejecuta algunos tests para ver los resultados.
            </p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.type === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {result.testName || 'Test'}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      result.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.type === 'success' ? 'Éxito' : 'Error'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {result.message}
                  </p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700">
                        Ver datos
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                        {formatData(result.data)}
                      </pre>
                    </details>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenAPITester; 