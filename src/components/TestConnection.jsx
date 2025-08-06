import React, { useState } from 'react';
import budgetService from '../services/budgetService';

const TestConnection = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test, status, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);

    try {
      // Test 1: Obtener presupuestos
      addResult('GET /budgets', 'running', 'Probando obtención de presupuestos...');
      try {
        const budgets = await budgetService.getAllBudgets();
        addResult('GET /budgets', 'success', `Encontrados ${budgets.length} presupuestos`, budgets);
      } catch (error) {
        addResult('GET /budgets', 'error', error.message);
      }

      // Test 2: Obtener presupuesto específico
      addResult('GET /budgets/1', 'running', 'Probando obtención de presupuesto específico...');
      try {
        const budget = await budgetService.getBudgetById(1);
        addResult('GET /budgets/1', 'success', 'Presupuesto obtenido correctamente', budget);
      } catch (error) {
        addResult('GET /budgets/1', 'error', error.message);
      }

      // Test 3: Actualizar estado
      addResult('PUT /budgets/1/status', 'running', 'Probando actualización de estado...');
      try {
        const result = await budgetService.updateBudgetStatus(1, {
          status: 'EN_REVISION',
          responseNotes: 'Test desde navegador'
        });
        addResult('PUT /budgets/1/status', 'success', 'Estado actualizado correctamente', result);
      } catch (error) {
        addResult('PUT /budgets/1/status', 'error', error.message);
      }

    } catch (error) {
      addResult('General', 'error', `Error general: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">🧪 Test de Conectividad</h2>
        <p className="text-gray-400 mb-6">
          Prueba la conectividad con el backend y verifica que todas las operaciones funcionen correctamente.
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={runTests}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              isLoading 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Ejecutando Tests...' : 'Ejecutar Tests'}
          </button>
          
          <button
            onClick={clearResults}
            className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors duration-200"
          >
            Limpiar Resultados
          </button>
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Resultados de los Tests</h3>
          
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                result.status === 'success' 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : result.status === 'error'
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-yellow-500/10 border-yellow-500/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-medium ${
                      result.status === 'success' 
                        ? 'text-green-400' 
                        : result.status === 'error'
                        ? 'text-red-400'
                        : 'text-yellow-400'
                    }`}>
                      {result.test}
                    </h4>
                    <p className="text-gray-400 text-sm">{result.message}</p>
                    <p className="text-gray-500 text-xs">{result.timestamp}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    result.status === 'success' 
                      ? 'bg-green-500/20 text-green-400' 
                      : result.status === 'error'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {result.status.toUpperCase()}
                  </div>
                </div>
                
                {result.data && (
                  <details className="mt-3">
                    <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                      Ver datos de respuesta
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-700/50 rounded text-xs text-gray-300 overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestConnection; 