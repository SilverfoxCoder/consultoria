import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import {
    XMarkIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    MapIcon
} from '@heroicons/react/24/outline';
import { useTranslations } from '../../../hooks/useTranslations';

const ProjectTimelineModal = ({ isOpen, onClose, projects }) => {
    const { t } = useTranslations();
    const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (projects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projects[0].id);
        }
    }, [projects, selectedProjectId]);

    useEffect(() => {
        if (selectedProjectId) {
            const project = projects.find(p => p.id === Number(selectedProjectId));
            setSelectedProject(project);
        }
    }, [selectedProjectId, projects]);

    if (!isOpen) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'Pendiente';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'in-progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'pending': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <MapIcon className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <Dialog.Title as="h3" className="text-xl font-bold text-white">
                                    {t('client.projectTimeline') || 'Línea de Tiempo del Proyecto'}
                                </Dialog.Title>
                                <p className="text-gray-400 text-sm">
                                    Seguimiento de hitos y progreso
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Project Selector */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Seleccionar Proyecto
                        </label>
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="w-full md:w-1/2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.title || `Proyecto #${project.id}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedProject ? (
                        <div className="relative">
                            {/* Main Line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700" />

                            <div className="space-y-8">
                                {/* Start Date */}
                                <div className="relative flex items-start group">
                                    <div className="absolute left-8 -ml-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-green-500 bg-gray-900 z-10" />
                                    <div className="ml-16 w-full">
                                        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50 hover:bg-gray-700/50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-white font-medium">Inicio del Proyecto</h4>
                                                    <p className="text-sm text-gray-400 mt-1">Fecha oficial de comienzo</p>
                                                </div>
                                                <div className="flex items-center text-sm text-green-400">
                                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                                    {formatDate(selectedProject.startDate)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Milestones / Tasks */}
                                {(selectedProject.tasks || []).map((task, index) => (
                                    <div key={index} className="relative flex items-start group">
                                        <div className={`absolute left-8 -ml-1.5 mt-1.5 h-3 w-3 rounded-full border-2 z-10 
                      ${task.status === 'completed' ? 'border-green-500 bg-green-500' :
                                                task.status === 'in-progress' ? 'border-blue-500 bg-gray-900' : 'border-gray-500 bg-gray-900'}`}
                                        />
                                        <div className="ml-16 w-full">
                                            <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50 hover:bg-gray-700/50 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-white font-medium">{task.title}</h4>
                                                        <p className="text-sm text-gray-400 mt-1">{task.description || 'Sin descripción detallada'}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                                                        {task.status === 'completed' ? 'Completado' :
                                                            task.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                                                    </span>
                                                </div>
                                                {task.dueDate && (
                                                    <div className="mt-2 flex items-center text-xs text-gray-400">
                                                        <ClockIcon className="h-3 w-3 mr-1" />
                                                        Vence: {formatDate(task.dueDate)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Estimated End Date */}
                                <div className="relative flex items-start group">
                                    <div className="absolute left-8 -ml-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-purple-500 bg-gray-900 z-10" />
                                    <div className="ml-16 w-full">
                                        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50 hover:bg-gray-700/50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-white font-medium">Entrega Estimada</h4>
                                                    <p className="text-sm text-gray-400 mt-1">Finalización prevista del proyecto</p>
                                                </div>
                                                <div className="flex items-center text-sm text-purple-400">
                                                    <ProjectEndIcon className="h-4 w-4 mr-1" />
                                                    {formatDate(selectedProject.endDate || selectedProject.dueDate)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No hay proyectos seleccionados</p>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>

                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

const ProjectEndIcon = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
    </svg>
);

export default ProjectTimelineModal;
