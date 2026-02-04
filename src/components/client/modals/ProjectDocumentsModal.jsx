import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { projectService } from '../../../services/projectService';

const ProjectDocumentsModal = ({ isOpen, onClose, project }) => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && project?.id) {
            loadDocuments();
        }
    }, [isOpen, project]);

    const loadDocuments = async () => {
        try {
            setIsLoading(true);
            const docs = await projectService.getProjectDocuments(project.id);
            setDocuments(docs);
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 p-6 text-left align-middle shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                            Documentos: {project?.name}
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="mt-4">
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-2 text-gray-400">Cargando documentos...</p>
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl">
                                <DocumentTextIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400">No hay documentos disponibles para este proyecto.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50 hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                                                <DocumentTextIcon className="h-6 w-6 text-blue-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{doc.originalFilename}</p>
                                                <p className="text-xs text-gray-400">
                                                    {(doc.fileSize / 1024).toFixed(1)} KB • {new Date(doc.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={projectService.getDownloadDocumentUrl(doc.id)}
                                            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
                                            download
                                        >
                                            <ArrowDownTrayIcon className="h-4 w-4" />
                                            <span>Descargar</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ProjectDocumentsModal;
