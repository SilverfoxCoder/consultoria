import React, { useState, useEffect } from 'react';
import { useStatus } from '../hooks/useStatus';

const SystemStatus = () => {
  const {
    status,
    isLoading,
    error,
    isPolling,
    startPolling,
    stopPolling,
    getFullStatus,
    checkBackendHealth,
    getSystemMetrics
  } = useStatus(5000); // Polling cada 5 segundos

  const [metrics, setMetrics] = useState(null);
  const [backendHealth, setBackendHealth] = useState(null);

  // Verificar salud del backend al cargar
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendHealth(isHealthy);
    };
    checkHealth();
  }, [checkBackendHealth]);

  // Cargar métricas del sistema
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const systemMetrics = await getSystemMetrics();
        setMetrics(systemMetrics);
      } catch (err) {
        console.error('Error loading metrics:', err);
      }
    };
    loadMetrics();
  }, [getSystemMetrics]);

  const handleTogglePolling = () => {
    if (isPolling) {
      stopPolling();
    } else {
      startPolling();
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await getFullStatus();
    } catch (err) {
      console.error('Error refreshing status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Estado del Sistema</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleTogglePolling}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isPolling
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isPolling ? 'Detener Polling' : 'Iniciar Polling'}
          </button>
          <button
            onClick={handleRefreshStatus}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
          >
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-md">
          <p className="text-red-200">Error: {error}</p>
        </div>
      )}

      {/* Estado del Backend */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-3">Conectividad Backend</h4>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            backendHealth ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-gray-300">
            {backendHealth ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>

      {/* Estado del Sistema */}
      {status && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-white mb-3">Estado del Sistema</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-md">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Estado General</h5>
              <p className="text-white">{status.status || 'Desconocido'}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Última Actualización</h5>
              <p className="text-white">
                {status.timestamp ? new Date(status.timestamp).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Métricas del Sistema */}
      {metrics && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-white mb-3">Métricas del Sistema</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-md">
              <h5 className="text-sm font-medium text-gray-300 mb-2">CPU</h5>
              <p className="text-white">{metrics.cpu || 'N/A'}%</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Memoria</h5>
              <p className="text-white">{metrics.memory || 'N/A'}%</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Disco</h5>
              <p className="text-white">{metrics.disk || 'N/A'}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Información de Polling */}
      <div className="bg-gray-700 p-4 rounded-md">
        <h4 className="text-lg font-medium text-white mb-3">Información de Polling</h4>
        <div className="space-y-2 text-sm text-gray-300">
          <p>Estado: {isPolling ? 'Activo' : 'Inactivo'}</p>
          <p>Intervalo: 5 segundos</p>
          <p>Endpoint: /api/status/system</p>
          <p>Método: REST (GET)</p>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus; 