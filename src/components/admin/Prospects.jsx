import React, { useState, useEffect } from 'react';
import { prospectService } from '../../services/prospectService';

const Prospects = () => {
    const [prospects, setProspects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [searchCity, setSearchCity] = useState('Madrid');
    const [showSearchModal, setShowSearchModal] = useState(false);

    // Load prospects on mount
    useEffect(() => {
        loadProspects();
    }, []);

    const loadProspects = async () => {
        try {
            setIsLoading(true);
            const data = await prospectService.getProspects();
            // Ensure data is an array
            setProspects(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Error al cargar los prospectos');
            console.error('Error loading prospects:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTriggerSearch = async (e) => {
        e.preventDefault();
        if (!searchCity.trim()) return;

        try {
            setIsSearching(true);
            setShowSearchModal(false);
            // Determine if we should show a loading toast or just set state
            // For now, we rely on the button state or global loading indicator if we had one
            await prospectService.triggerSearch(searchCity);
            // Reload list after triggering (it might take a while for results to appear, 
            // ideally we would poll or wait for websocket, but requirement says "might take a few seconds")
            // We'll wait a bit then reload
            setTimeout(loadProspects, 2000);
            alert(`Búsqueda iniciada para ${searchCity}. Los resultados aparecerán pronto.`);
        } catch (err) {
            console.error('Error triggering search:', err);
            alert('Error al iniciar la búsqueda: ' + err.message);
        } finally {
            setIsSearching(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'NEW': return 'bg-blue-500';
            case 'CONTACTED': return 'bg-yellow-500';
            case 'CONVERTED': return 'bg-green-500';
            case 'DISCARDED': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    if (isLoading && prospects.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative z-10 text-white">
            {/* Header */}
            <div className="bg-black/40 backdrop-blur-sm border-b border-white/20 flex-none">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Prospectos</h1>
                            <p className="text-gray-300 mt-1">Leads encontrados autom&aacute;ticamente por el bot</p>
                        </div>
                        <button
                            onClick={() => setShowSearchModal(true)}
                            disabled={isSearching}
                            className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSearching ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Buscar Ahora
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto min-h-0 p-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 relative z-0">
                    <div className="min-w-full inline-block align-middle">
                        <table className="w-full">
                            <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur-sm">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Empresa</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ciudad</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tel&eacute;fono</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fuente</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Encontrado</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {prospects.length > 0 ? (
                                    prospects.map((prospect) => (
                                        <tr key={prospect.id} className="hover:bg-white/5 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-white">{prospect.companyName}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{prospect.city}</td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{prospect.phone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-400 truncate max-w-xs" title={prospect.source}>
                                                {prospect.source}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(prospect.status)} text-white`}>
                                                    {prospect.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{formatDate(prospect.foundAt)}</td>
                                            <td className="px-6 py-4">
                                                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium mr-3">Llamar</button>
                                                {/* Future: Convert to Client */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                                            No hay prospectos encontrados a&uacute;n. &iexcl;Inicia una b&uacute;squeda!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            {showSearchModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-6">Nueva B&uacute;squeda</h2>
                        <form onSubmit={handleTriggerSearch}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-200 mb-2">Ciudad a buscar</label>
                                <input
                                    type="text"
                                    value={searchCity}
                                    onChange={(e) => setSearchCity(e.target.value)}
                                    placeholder="Ej. Madrid, Barcelona..."
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowSearchModal(false)}
                                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                >
                                    Buscar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prospects;
