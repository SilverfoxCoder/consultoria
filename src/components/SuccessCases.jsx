import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const SuccessCases = () => {
  const { t, translations } = useTranslations();
  
  // Tecnologías y emojis para casos de éxito en el mismo orden que las traducciones
  const caseTechnologies = [
    ["React", "Node.js", "MongoDB", "AWS"],
    ["React Native", "Python", "PostgreSQL", "Google Maps API"],
    ["Python", "TensorFlow", "Docker", "Kubernetes"]
  ];
  
  const caseEmojis = ["🛒", "🚚", "🤖"];
  
  // Generar casos dinámicamente desde las traducciones
  const cases = translations?.successCases?.cases?.map((case_, index) => ({
    id: index + 1,
    title: case_?.title || `Caso ${index + 1}`,
    client: case_?.client || 'Cliente',
    description: case_?.description || 'Descripción del caso',
    results: case_?.results || 'Resultados obtenidos',
    technologies: caseTechnologies[index] || ["React", "Node.js"],
    image: caseEmojis[index] || "⭐"
  })) || [];

  return (
    <section id="casos-exito" className="section-padding relative">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-500 mb-4 drop-shadow-sm">
            {t('successCases.title')}
          </h2>
                      <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-sm">
            {t('successCases.subtitle')}
          </p>
        </div>

        {/* Cases Grid */}
        <div className="space-y-12">
          {cases.map((caseItem, index) => (
            <div
              key={caseItem.id}
              className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } lg:flex border border-white/20`}
            >
              {/* Case Image */}
              <div className="lg:w-1/3 bg-gradient-to-br from-primary-500 to-primary-600 p-12 flex items-center justify-center">
                <div className="text-8xl">{caseItem.image}</div>
              </div>

              {/* Case Content */}
              <div className="lg:w-2/3 p-8 lg:p-12">
                <div className="mb-4">
                  <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                    {caseItem.client}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-primary-500 mb-4">
                  {caseItem.title}
                </h3>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {caseItem.description}
                </p>

                {/* Results */}
                <div className="mb-6">
                  <h4 className="font-semibold text-primary-500 mb-3">{t('successCases.keyResults')}</h4>
                  <ul className="space-y-2">
                    {caseItem.results.map((result, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="font-semibold text-primary-500 mb-3">{t('successCases.technologies')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {caseItem.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 pt-12 border-t border-gray-200/50">
          <h3 className="text-2xl font-bold text-primary-500 mb-4 drop-shadow-sm">
            {t('successCases.cta.title')}
          </h3>
                      <p className="text-white mb-8 max-w-2xl mx-auto drop-shadow-sm">
            {t('successCases.cta.subtitle')}
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contacto');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t('successCases.cta.button')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessCases; 