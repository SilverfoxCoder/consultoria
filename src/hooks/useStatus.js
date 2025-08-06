import { useState, useEffect, useCallback } from 'react';
import { statusService } from '../services/statusService';

export const useStatus = (pollingInterval = 5000) => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  // Función para cargar el estado inicial
  const loadStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const systemStatus = await statusService.getSystemStatus();
      setStatus(systemStatus);
    } catch (err) {
      setError(err.message);
      console.error('Error loading system status:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para iniciar polling
  const startPolling = useCallback(() => {
    if (isPolling) return;
    
    setIsPolling(true);
    statusService.startPolling((newStatus) => {
      setStatus(newStatus);
      setError(null);
    }, pollingInterval);
  }, [isPolling, pollingInterval]);

  // Función para detener polling
  const stopPolling = useCallback(() => {
    statusService.stopPolling();
    setIsPolling(false);
  }, []);

  // Función para obtener estado completo
  const getFullStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fullStatus = await statusService.getFullStatus();
      setStatus(fullStatus);
      return fullStatus;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para verificar salud del backend
  const checkBackendHealth = useCallback(async () => {
    try {
      const isHealthy = await statusService.checkBackendHealth();
      return isHealthy;
    } catch (err) {
      console.error('Backend health check failed:', err);
      return false;
    }
  }, []);

  // Función para obtener métricas del sistema
  const getSystemMetrics = useCallback(async () => {
    try {
      const metrics = await statusService.getSystemMetrics();
      return metrics;
    } catch (err) {
      console.error('Error getting system metrics:', err);
      throw err;
    }
  }, []);

  // Función para obtener notificaciones
  const getNotifications = useCallback(async () => {
    try {
      const notifications = await statusService.getNotifications();
      return notifications;
    } catch (err) {
      console.error('Error getting notifications:', err);
      throw err;
    }
  }, []);

  // Cargar estado inicial al montar el componente
  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    status,
    isLoading,
    error,
    isPolling,
    loadStatus,
    startPolling,
    stopPolling,
    getFullStatus,
    checkBackendHealth,
    getSystemMetrics,
    getNotifications
  };
}; 