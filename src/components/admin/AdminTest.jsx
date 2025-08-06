import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { adminService } from '../../services/adminService';
import { 
  PlayIcon,
  UserIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const AdminTest = () => {
  const { lang } = useTranslations();
  
  // Estados para los formularios
  const [userRegistrationTest, setUserRegistrationTest] = useState({ userId: '1' });
  const [firstLoginTest, setFirstLoginTest] = useState({ userId: '1' });
  const [budgetRequestTest, setBudgetRequestTest] = useState({
    budgetId: '1',
    clientName: 'Cliente Test',
    projectName: 'Proyecto Test'
  });
  const [systemErrorTest, setSystemErrorTest] = useState({
    errorType: 'DATABASE',
    errorMessage: 'Error de conexión timeout'
  });
  const [unusualActivityTest, setUnusualActivityTest] = useState({
    activityType: 'High login attempts',
    count: '100'
  });
  
  // Estados de loading
  const [loadingStates, setLoadingStates] = useState({
    userRegistration: false,
    firstLogin: false,
    budgetRequest: false,
    systemError: false,
    unusualActivity: false,
    controller: false
  });

  // Estados de resultados
  const [results, setResults] = useState({});

  // Función auxiliar para manejar loading
  const setLoading = (key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  // Función auxiliar para mostrar resultado
  const showResult = (key, success, message) => {
    setResults(prev => ({ 
      ...prev, 
      [key]: { success, message, timestamp: new Date() }
    }));
    
    // Limpiar resultado después de 5 segundos
    setTimeout(() => {
      setResults(prev => {
        const newResults = { ...prev };
        delete newResults[key];
        return newResults;
      });
    }, 5000);
  };

  // Test de registro de usuario
  const handleTestUserRegistration = async () => {
    try {
      setLoading('userRegistration', true);
      await adminService.testUserRegistration(parseInt(userRegistrationTest.userId));
      showResult('userRegistration', true, 
        lang === 'es' 
          ? 'Notificación de registro de usuario enviada correctamente'
          : 'User registration notification sent successfully'
      );
    } catch (err) {
      console.error('Error testing user registration:', err);
      showResult('userRegistration', false, err.message);
    } finally {
      setLoading('userRegistration', false);
    }
  };

  // Test de primer login
  const handleTestFirstLogin = async () => {
    try {
      setLoading('firstLogin', true);
      await adminService.testFirstLogin(parseInt(firstLoginTest.userId));
      showResult('firstLogin', true,
        lang === 'es' 
          ? 'Notificación de primer login enviada correctamente'
          : 'First login notification sent successfully'
      );
    } catch (err) {
      console.error('Error testing first login:', err);
      showResult('firstLogin', false, err.message);
    } finally {
      setLoading('firstLogin', false);
    }
  };

  // Test de solicitud de presupuesto
  const handleTestBudgetRequest = async () => {
    try {
      setLoading('budgetRequest', true);
      await adminService.testBudgetRequest({
        budgetId: parseInt(budgetRequestTest.budgetId),
        clientName: budgetRequestTest.clientName,
        projectName: budgetRequestTest.projectName
      });
      showResult('budgetRequest', true,
        lang === 'es' 
          ? 'Notificación de solicitud de presupuesto enviada correctamente'
          : 'Budget request notification sent successfully'
      );
    } catch (err) {
      console.error('Error testing budget request:', err);
      showResult('budgetRequest', false, err.message);
    } finally {
      setLoading('budgetRequest', false);
    }
  };

  // Test de error del sistema
  const handleTestSystemError = async () => {
    try {
      setLoading('systemError', true);
      await adminService.testSystemError({
        errorType: systemErrorTest.errorType,
        errorMessage: systemErrorTest.errorMessage
      });
      showResult('systemError', true,
        lang === 'es' 
          ? 'Notificación de error del sistema enviada correctamente'
          : 'System error notification sent successfully'
      );
    } catch (err) {
      console.error('Error testing system error:', err);
      showResult('systemError', false, err.message);
    } finally {
      setLoading('systemError', false);
    }
  };

  // Test de actividad inusual
  const handleTestUnusualActivity = async () => {
    try {
      setLoading('unusualActivity', true);
      await adminService.testUnusualActivity({
        activityType: unusualActivityTest.activityType,
        count: parseInt(unusualActivityTest.count)
      });
      showResult('unusualActivity', true,
        lang === 'es' 
          ? 'Notificación de actividad inusual enviada correctamente'
          : 'Unusual activity notification sent successfully'
      );
    } catch (err) {
      console.error('Error testing unusual activity:', err);
      showResult('unusualActivity', false, err.message);
    } finally {
      setLoading('unusualActivity', false);
    }
  };

  // Test del controlador
  const handleTestController = async () => {
    try {
      setLoading('controller', true);
      const response = await adminService.testController();
      showResult('controller', true,
        lang === 'es' 
          ? `Controlador funcionando: ${response.message || 'OK'}`
          : `Controller working: ${response.message || 'OK'}`
      );
    } catch (err) {
      console.error('Error testing controller:', err);
      showResult('controller', false, err.message);
    } finally {
      setLoading('controller', false);
    }
  };

  // Componente para mostrar resultado
  const ResultAlert = ({ result }) => {
    if (!result) return null;
    
    return (
      <div className={`mt-3 p-3 rounded-lg border ${
        result.success 
          ? 'bg-green-500/20 border-green-500/50 text-green-300'
          : 'bg-red-500/20 border-red-500/50 text-red-300'
      }`}>
        <div className="flex items-center gap-2">
          {result.success ? (
            <CheckCircleIcon className="h-4 w-4" />
          ) : (
            <ExclamationTriangleIcon className="h-4 w-4" />
          )}
          <span className="text-sm">{result.message}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <BeakerIcon className="h-8 w-8 text-primary-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {lang === 'es' ? 'Pruebas de Notificaciones' : 'Notification Tests'}
              </h1>
              <p className="text-gray-300 mt-1">
                {lang === 'es' 
                  ? 'Prueba todas las funcionalidades de notificaciones para administradores'
                  : 'Test all admin notification functionalities'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test del Controlador */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                {lang === 'es' ? 'Test del Controlador' : 'Controller Test'}
              </h2>
              <p className="text-gray-300">
                {lang === 'es' 
                  ? 'Verifica que el controlador de administración esté funcionando'
                  : 'Verify that the admin controller is working'
                }
              </p>
            </div>
            <button
              onClick={handleTestController}
              disabled={loadingStates.controller}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {loadingStates.controller ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                  {lang === 'es' ? 'Probando...' : 'Testing...'}
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 inline mr-2" />
                  {lang === 'es' ? 'Probar' : 'Test'}
                </>
              )}
            </button>
          </div>
          <ResultAlert result={results.controller} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test de Registro de Usuario */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserIcon className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-bold text-white">
                {lang === 'es' ? 'Registro de Usuario' : 'User Registration'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'es' ? 'ID del Usuario' : 'User ID'}
                </label>
                <input
                  type="number"
                  value={userRegistrationTest.userId}
                  onChange={(e) => setUserRegistrationTest({ ...userRegistrationTest, userId: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="1"
                />
              </div>
              
              <button
                onClick={handleTestUserRegistration}
                disabled={loadingStates.userRegistration}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {loadingStates.userRegistration ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                    {lang === 'es' ? 'Enviando...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 inline mr-2" />
                    {lang === 'es' ? 'Simular Registro' : 'Simulate Registration'}
                  </>
                )}
              </button>
              
              <ResultAlert result={results.userRegistration} />
            </div>
          </div>

          {/* Test de Primer Login */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-bold text-white">
                {lang === 'es' ? 'Primer Login' : 'First Login'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'es' ? 'ID del Usuario' : 'User ID'}
                </label>
                <input
                  type="number"
                  value={firstLoginTest.userId}
                  onChange={(e) => setFirstLoginTest({ ...firstLoginTest, userId: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="1"
                />
              </div>
              
              <button
                onClick={handleTestFirstLogin}
                disabled={loadingStates.firstLogin}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {loadingStates.firstLogin ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                    {lang === 'es' ? 'Enviando...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 inline mr-2" />
                    {lang === 'es' ? 'Simular Primer Login' : 'Simulate First Login'}
                  </>
                )}
              </button>
              
              <ResultAlert result={results.firstLogin} />
            </div>
          </div>

          {/* Test de Solicitud de Presupuesto */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <DocumentTextIcon className="h-6 w-6 text-yellow-500" />
              <h3 className="text-lg font-bold text-white">
                {lang === 'es' ? 'Solicitud de Presupuesto' : 'Budget Request'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'es' ? 'ID del Presupuesto' : 'Budget ID'}
                </label>
                <input
                  type="number"
                  value={budgetRequestTest.budgetId}
                  onChange={(e) => setBudgetRequestTest({ ...budgetRequestTest, budgetId: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'es' ? 'Nombre del Cliente' : 'Client Name'}
                </label>
                <input
                  type="text"
                  value={budgetRequestTest.clientName}
                  onChange={(e) => setBudgetRequestTest({ ...budgetRequestTest, clientName: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Cliente Test"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'es' ? 'Nombre del Proyecto' : 'Project Name'}
                </label>
                <input
                  type="text"
                  value={budgetRequestTest.projectName}
                  onChange={(e) => setBudgetRequestTest({ ...budgetRequestTest, projectName: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Proyecto Test"
                />
              </div>
              
              <button
                onClick={handleTestBudgetRequest}
                disabled={loadingStates.budgetRequest}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {loadingStates.budgetRequest ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                    {lang === 'es' ? 'Enviando...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 inline mr-2" />
                    {lang === 'es' ? 'Simular Solicitud' : 'Simulate Request'}
                  </>
                )}
              </button>
              
              <ResultAlert result={results.budgetRequest} />
            </div>
          </div>

          {/* Test de Error del Sistema */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-bold text-white">
                {lang === 'es' ? 'Error del Sistema' : 'System Error'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'es' ? 'Tipo de Error' : 'Error Type'}
                </label>
                <select
                  value={systemErrorTest.errorType}
                  onChange={(e) => setSystemErrorTest({ ...systemErrorTest, errorType: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="DATABASE">DATABASE</option>
                  <option value="NETWORK">NETWORK</option>
                  <option value="AUTHENTICATION">AUTHENTICATION</option>
                  <option value="VALIDATION">VALIDATION</option>
                  <option value="INTERNAL">INTERNAL</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'es' ? 'Mensaje de Error' : 'Error Message'}
                </label>
                <textarea
                  value={systemErrorTest.errorMessage}
                  onChange={(e) => setSystemErrorTest({ ...systemErrorTest, errorMessage: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Error de conexión timeout"
                />
              </div>
              
              <button
                onClick={handleTestSystemError}
                disabled={loadingStates.systemError}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {loadingStates.systemError ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                    {lang === 'es' ? 'Enviando...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 inline mr-2" />
                    {lang === 'es' ? 'Simular Error' : 'Simulate Error'}
                  </>
                )}
              </button>
              
              <ResultAlert result={results.systemError} />
            </div>
          </div>
        </div>

        {/* Test de Actividad Inusual */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-500" />
            <h3 className="text-lg font-bold text-white">
              {lang === 'es' ? 'Actividad Inusual' : 'Unusual Activity'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {lang === 'es' ? 'Tipo de Actividad' : 'Activity Type'}
              </label>
              <input
                type="text"
                value={unusualActivityTest.activityType}
                onChange={(e) => setUnusualActivityTest({ ...unusualActivityTest, activityType: e.target.value })}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="High login attempts"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {lang === 'es' ? 'Cantidad' : 'Count'}
              </label>
              <input
                type="number"
                value={unusualActivityTest.count}
                onChange={(e) => setUnusualActivityTest({ ...unusualActivityTest, count: e.target.value })}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="100"
              />
            </div>
          </div>
          
          <button
            onClick={handleTestUnusualActivity}
            disabled={loadingStates.unusualActivity}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 mt-4"
          >
            {loadingStates.unusualActivity ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                {lang === 'es' ? 'Enviando...' : 'Sending...'}
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4 inline mr-2" />
                {lang === 'es' ? 'Simular Actividad Inusual' : 'Simulate Unusual Activity'}
              </>
            )}
          </button>
          
          <ResultAlert result={results.unusualActivity} />
        </div>
      </div>
    </div>
  );
};

export default AdminTest;