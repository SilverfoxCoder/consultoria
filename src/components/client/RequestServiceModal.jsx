import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { serviceService } from '../../services/serviceService';
import { useTranslations } from '../../hooks/useTranslations';
import { useAuth } from '../../contexts/AuthContext';

const RequestServiceModal = ({ isOpen, onClose, onServiceCreated }) => {
    const { t } = useTranslations();
    const { user, clientId } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        serviceType: 'consultoria',
        preferredDate: '',
        budget: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const serviceTypes = [
        { id: 'consultoria', name: 'Consultoría Tecnológica' },
        { id: 'desarrollo', name: 'Desarrollo de Software' },
        { id: 'auditoria', name: 'Auditoría y Seguridad' },
        { id: 'mantenimiento', name: 'Soporte y Mantenimiento' },
        { id: 'cloud', name: 'Servicios Cloud' },
        { id: 'otro', name: 'Otro' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const finalClientId = clientId || user?.id || 1;

            const newService = {
                ...formData,
                clientId: finalClientId,
                status: 'scheduled', // Estado inicial
                budget: parseFloat(formData.budget) || 0
            };

            await serviceService.createService(newService);

            onServiceCreated();
            onClose();
            // Reset form
            setFormData({
                title: '',
                description: '',
                serviceType: 'consultoria',
                preferredDate: '',
                budget: ''
            });
        } catch (err) {
            console.error('Error creating service:', err);
            setError('Error al solicitar el servicio. Por favor intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-white"
                                    >
                                        {t('client.requestService')}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Título del Proyecto
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Ej: Migración a Cloud"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Tipo de Servicio
                                        </label>
                                        <select
                                            name="serviceType"
                                            value={formData.serviceType}
                                            onChange={handleChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            {serviceTypes.map(type => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Descripción Detallada
                                        </label>
                                        <textarea
                                            name="description"
                                            required
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Describe tus necesidades..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Fecha Preferida
                                            </label>
                                            <input
                                                type="date"
                                                name="preferredDate"
                                                value={formData.preferredDate}
                                                onChange={handleChange}
                                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Presupuesto Estimado
                                            </label>
                                            <input
                                                type="number"
                                                name="budget"
                                                value={formData.budget}
                                                onChange={handleChange}
                                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="Ej: 5000"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                                            disabled={isLoading}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Enviando...
                                                </>
                                            ) : (
                                                'Enviar Solicitud'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default RequestServiceModal;
