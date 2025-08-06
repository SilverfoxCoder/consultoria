import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { adminService } from '../../services/adminService';
import { 
  UsersIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BellIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const AdminStats = () => {
  const { lang } = useTranslations();
  
  // Estados principales
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Estados para envío manual de estadísticas
  const [sendingDaily, setSendingDaily] = useState(false);
  const [sendingWeekly, setSendingWeekly] = useState(false);
  const [sendingMonthly, setSendingMonthly] = useState(false);

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await adminService.getSystemStats();
      setStats(response);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading system stats:', err);
      setError('Error al cargar las estadísticas del sistema');
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para cargar estadísticas
  useEffect(() => {
    loadStats();
  }, []);

  // Enviar estadísticas diarias
  const handleSendDailyStats = async () => {
    try {
      setSendingDaily(true);
      await adminService.sendDailyStats();
      
      // Mostrar confirmación
      alert(lang === 'es' 
        ? 'Estadísticas diarias enviadas correctamente' 
        : 'Daily statistics sent successfully'
      );
      
      // Recargar estadísticas
      loadStats();
    } catch (err) {
      console.error('Error sending daily stats:', err);
      alert(lang === 'es' 
        ? 'Error al enviar estadísticas diarias' 
        : 'Error sending daily statistics'
      );
    } finally {
      setSendingDaily(false);
    }
  };

  // Enviar estadísticas semanales
  const handleSendWeeklyStats = async () => {
    try {
      setSendingWeekly(true);
      await adminService.sendWeeklyStats();
      
      alert(lang === 'es' 
        ? 'Estadísticas semanales enviadas correctamente' 
        : 'Weekly statistics sent successfully'
      );
      
      loadStats();
    } catch (err) {
      console.error('Error sending weekly stats:', err);
      alert(lang === 'es' 
        ? 'Error al enviar estadísticas semanales' 
        : 'Error sending weekly statistics'
      );
    } finally {
      setSendingWeekly(false);
    }
  };

  // Enviar estadísticas mensuales
  const handleSendMonthlyStats = async () => {
    try {
      setSendingMonthly(true);
      await adminService.sendMonthlyStats();
      
      alert(lang === 'es' 
        ? 'Estadísticas mensuales enviadas correctamente' 
        : 'Monthly statistics sent successfully'
      );
      
      loadStats();
    } catch (err) {
      console.error('Error sending monthly stats:', err);
      alert(lang === 'es' 
        ? 'Error al enviar estadísticas mensuales' 
        : 'Error sending monthly statistics'
      );
    } finally {
      setSendingMonthly(false);
    }
  };

  // Render de loading
  if (isLoading) {
    return (
      <div className="min-h-screen relative z-10">
        <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              {lang === 'es' ? 'Estadísticas del Sistema' : 'System Statistics'}
            </h1>
            <p className="text-gray-300 mt-1">
              {lang === 'es' ? 'Resumen y métricas del sistema' : 'System summary and metrics'}
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-400">
              {lang === 'es' ? 'Cargando estadísticas...' : 'Loading statistics...'}
            </span>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {lang === 'es' ? 'Estadísticas del Sistema' : 'System Statistics'}
              </h1>
              <p className="text-gray-300 mt-1">
                {lang === 'es' ? 'Resumen y métricas del sistema' : 'System summary and metrics'}
              </p>
              {lastUpdated && (
                <p className="text-sm text-gray-400 mt-2">
                  {lang === 'es' ? 'Última actualización: ' : 'Last updated: '}
                  {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={loadStats}
              disabled={isLoading}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              <ArrowPathIcon className="h-5 w-5 inline mr-2" />
              {lang === 'es' ? 'Actualizar' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Estadísticas Principales */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total de Usuarios */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      {lang === 'es' ? 'Total Usuarios' : 'Total Users'}
                    </p>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers || 0}</p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <UsersIcon className="w-6 h-6 text-white" />
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
                    <p className="text-3xl font-bold text-white">{stats.activeUsers || 0}</p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <UserGroupIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Total Notificaciones */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      {lang === 'es' ? 'Total Notificaciones' : 'Total Notifications'}
                    </p>
                    <p className="text-3xl font-bold text-white">{stats.totalNotifications || 0}</p>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <BellIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Notificaciones Admin No Leídas */}
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">
                      {lang === 'es' ? 'Admin Sin Leer' : 'Unread Admin'}
                    </p>
                    <p className="text-3xl font-bold text-white">{stats.unreadAdminNotifications || 0}</p>
                  </div>
                  <div className="bg-orange-500/20 p-3 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de Envío Manual */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">
                {lang === 'es' ? 'Envío Manual de Estadísticas' : 'Manual Statistics Sending'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Estadísticas Diarias */}
                <div className="bg-black/40 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <CalendarIcon className="h-6 w-6 text-blue-500" />
                    <h3 className="text-lg font-semibold text-white">
                      {lang === 'es' ? 'Estadísticas Diarias' : 'Daily Statistics'}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {lang === 'es' 
                      ? 'Envía el resumen de actividad del día actual'
                      : 'Send current day activity summary'
                    }
                  </p>
                  <button
                    onClick={handleSendDailyStats}
                    disabled={sendingDaily}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingDaily ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                        {lang === 'es' ? 'Enviando...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <ChartBarIcon className="h-4 w-4 inline mr-2" />
                        {lang === 'es' ? 'Enviar Diarias' : 'Send Daily'}
                      </>
                    )}
                  </button>
                </div>

                {/* Estadísticas Semanales */}
                <div className="bg-black/40 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <CalendarIcon className="h-6 w-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-white">
                      {lang === 'es' ? 'Estadísticas Semanales' : 'Weekly Statistics'}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {lang === 'es' 
                      ? 'Envía el resumen de actividad de la semana'
                      : 'Send current week activity summary'
                    }
                  </p>
                  <button
                    onClick={handleSendWeeklyStats}
                    disabled={sendingWeekly}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingWeekly ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                        {lang === 'es' ? 'Enviando...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <ChartBarIcon className="h-4 w-4 inline mr-2" />
                        {lang === 'es' ? 'Enviar Semanales' : 'Send Weekly'}
                      </>
                    )}
                  </button>
                </div>

                {/* Estadísticas Mensuales */}
                <div className="bg-black/40 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <CalendarIcon className="h-6 w-6 text-purple-500" />
                    <h3 className="text-lg font-semibold text-white">
                      {lang === 'es' ? 'Estadísticas Mensuales' : 'Monthly Statistics'}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {lang === 'es' 
                      ? 'Envía el resumen de actividad del mes'
                      : 'Send current month activity summary'
                    }
                  </p>
                  <button
                    onClick={handleSendMonthlyStats}
                    disabled={sendingMonthly}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingMonthly ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                        {lang === 'es' ? 'Enviando...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <ChartBarIcon className="h-4 w-4 inline mr-2" />
                        {lang === 'es' ? 'Enviar Mensuales' : 'Send Monthly'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Información Programada */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {lang === 'es' ? 'Programación Automática' : 'Automatic Scheduling'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <ClockIcon className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium text-white">
                      {lang === 'es' ? 'Diarias' : 'Daily'}
                    </h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'es' ? 'Todos los días a las 8:00 AM' : 'Every day at 8:00 AM'}
                  </p>
                </div>
                
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <ClockIcon className="h-5 w-5 text-green-500" />
                    <h4 className="font-medium text-white">
                      {lang === 'es' ? 'Semanales' : 'Weekly'}
                    </h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'es' ? 'Lunes a las 9:00 AM' : 'Mondays at 9:00 AM'}
                  </p>
                </div>
                
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <ClockIcon className="h-5 w-5 text-purple-500" />
                    <h4 className="font-medium text-white">
                      {lang === 'es' ? 'Mensuales' : 'Monthly'}
                    </h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'es' ? 'Primer día del mes a las 10:00 AM' : 'First day of month at 10:00 AM'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminStats;