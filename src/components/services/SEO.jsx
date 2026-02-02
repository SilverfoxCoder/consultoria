import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import {
    MagnifyingGlassIcon,
    ChartBarIcon,
    CodeBracketIcon,
    LinkIcon,
    DocumentTextIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const SEO = () => {
    const { t } = useTranslations();

    const strategies = [
        {
            title: "Auditoría Técnica Completa",
            description: "Analizamos la estructura, velocidad y código de tu web para identificar barreras que impiden tu indexación.",
            icon: <CodeBracketIcon className="w-8 h-8 text-primary-500" />
        },
        {
            title: "Investigación de Palabras Clave",
            description: "Identificamos los términos exactos que tus clientes usan para buscar tus servicios.",
            icon: <MagnifyingGlassIcon className="w-8 h-8 text-primary-500" />
        },
        {
            title: "Optimización On-Page",
            description: "Mejoramos contenido, metaetiquetas y estructura interna para máxima relevancia semántica.",
            icon: <DocumentTextIcon className="w-8 h-8 text-primary-500" />
        },
        {
            title: "Estrategia de Contenidos",
            description: "Creamos contenido de alto valor que responde a la intención de búsqueda del usuario.",
            icon: <ChartBarIcon className="w-8 h-8 text-primary-500" />
        },
        {
            title: "Link Building Ético",
            description: "Aumentamos la autoridad de tu dominio consiguiendo enlaces de calidad de sitios relevantes.",
            icon: <LinkIcon className="w-8 h-8 text-primary-500" />
        },
        {
            title: "Monitorización y Reporting",
            description: "Seguimiento constante de posiciones y tráfico para ajustar la estrategia en tiempo real.",
            icon: <ArrowTrendingUpIcon className="w-8 h-8 text-primary-500" />
        }
    ];

    return (
        <div className="pt-20 min-h-screen">
            {/* Hero Section */}
            <section className="relative px-6 py-20 overflow-hidden">
                <div className="container-max relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400 mb-6 animate-fade-in-up">
                            Posicionamiento Orgánico (SEO)
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up delay-100">
                            Convierte tu web en tu mejor canal de ventas apareciendo cuando tus clientes te buscan.
                        </p>
                    </div>
                </div>
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px] -z-10" />
            </section>

            {/* What is SEO Section */}
            <section className="px-6 py-16 bg-white/5 backdrop-blur-sm">
                <div className="container-max">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">¿Qué es el SEO y por qué lo necesitas?</h2>
                            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                El <strong>Search Engine Optimization (SEO)</strong> no es magia, es ingeniería de información. Se trata de optimizar tu presencia digital para que Google entienda que eres la mejor respuesta para las preguntas de tus clientes.
                            </p>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                A diferencia de la publicidad pagada (SEM), el tráfico orgánico es <strong>gratuito, sostenible y de mayor calidad</strong>. Una buena estrategia SEO es la inversión más rentable a medio y largo plazo para cualquier negocio digital.
                            </p>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative bg-gray-900 rounded-2xl p-8 border border-white/10">
                                <ul className="space-y-4">
                                    <li className="flex items-center text-gray-300">
                                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                                        Mayor visibilidad de marca
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                                        Tráfico cualificado (clientes, no solo visitas)
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                                        Mejor experiencia de usuario (UX)
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                                        Credibilidad y confianza
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="px-6 py-16">
                <div className="container-max">
                    <div className="bg-gradient-to-r from-primary-900/50 to-secondary-900/50 rounded-3xl p-1 md:p-2 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">
                        <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video group">
                            <video
                                className="w-full h-full object-cover"
                                controls
                                playsInline
                                poster="/assets/images/branding/poster-seo.jpg" // Optional: You might want to ask for a poster later, but for now browser will pick first frame
                            >
                                <source src="/assets/images/branding/Video_Generado_En_Español.mp4" type="video/mp4" />
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </div>
                        <div className="text-center mt-6 mb-4">
                            <p className="text-gray-400 text-sm">
                                Descubre cómo nuestra estrategia SEO puede transformar tu negocio
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategy Grid */}
            <section className="px-6 py-20">
                <div className="container-max">
                    <h2 className="text-3xl font-bold text-center text-white mb-16">Nuestra Metodología SEO</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {strategies.map((item, index) => (
                            <div key={index} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                                <div className="mb-6 p-4 bg-gray-800 rounded-xl w-fit group-hover:bg-primary-900/30 transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-20 bg-gradient-to-b from-transparent to-primary-900/20">
                <div className="container-max text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">¿Listo para escalar posiciones en Google?</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        No dejes que tu competencia se lleve a tus clientes. Empecemos con una auditoría gratuita de tu estado actual.
                    </p>
                    <button
                        onClick={() => {
                            const element = document.getElementById('contacto');
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-primary-500/30"
                    >
                        Solicitar Auditoría SEO
                    </button>
                </div>
            </section>
        </div>
    );
};

export default SEO;
