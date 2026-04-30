import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { 
  WrenchScrewdriverIcon, 
  BuildingStorefrontIcon, 
  SparklesIcon, 
  HomeModernIcon,
  ShoppingCartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const apps = [
  {
    id: 'tallertech',
    name: 'TallerTech',
    description: 'Gestión integral para talleres mecánicos. Control de reparaciones, inventario y facturación.',
    url: 'https://tallertech.vercel.app/',
    icon: WrenchScrewdriverIcon,
    color: 'text-blue-500',
    darkColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    darkBgColor: 'bg-blue-400/10'
  },
  {
    id: 'hosteleria',
    name: 'HosteleriaApp',
    description: 'Solución completa para bares y restaurantes. TPV, pedidos y reservas.',
    url: 'https://hosteleria-app.vercel.app/',
    icon: BuildingStorefrontIcon,
    color: 'text-orange-500',
    darkColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    darkBgColor: 'bg-orange-400/10',
    image: '/assets/images/branding/Gemini_Generated_Image_ec7obmec7obmec7o.png'
  },
  {
    id: 'pelutech',
    name: 'PeluTech',
    description: 'Software para salones de belleza y peluquerías. Citas, clientes y caja de cobro rápido.',
    url: 'https://pelutech-landing.vercel.app/',
    icon: SparklesIcon,
    color: 'text-purple-500',
    darkColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    darkBgColor: 'bg-purple-400/10'
  },
  {
    id: 'inmocrm',
    name: 'InmoCRM',
    description: 'CRM avanzado para agencias inmobiliarias. Propiedades, clientes, contratos y portales.',
    url: 'https://inmocrm-one.vercel.app/',
    icon: HomeModernIcon,
    color: 'text-green-500',
    darkColor: 'text-green-400',
    bgColor: 'bg-green-500/10',
    darkBgColor: 'bg-green-400/10'
  },
  {
    id: 'fluxmanager',
    name: 'FluxManager',
    description: 'Sistema integral para retail y comercio. Control avanzado de punto de venta y gestión de stock.',
    url: 'https://fluxmanager.vercel.app/',
    icon: ShoppingCartIcon,
    color: 'text-indigo-500',
    darkColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    darkBgColor: 'bg-indigo-400/10'
  }
];

const HubAppsSection = ({ variant = 'light' }) => {
  const { t } = useTranslations();
  const isDark = variant === 'dark';

  const containerClass = "w-full mt-12 mb-12";

  const headerClass = "text-2xl lg:text-3xl font-bold text-white mb-4 text-center";

  const subtitleClass = "text-base lg:text-lg text-white/80 max-w-2xl mx-auto text-center mb-10";

  const gridClass = isDark
    ? "flex flex-wrap justify-center gap-8"
    : "flex flex-wrap justify-center gap-10";

  return (
    <div className={containerClass}>
      <div className={isDark ? "flex flex-col mb-6" : ""}>
        <h3 className={headerClass}>
          {t('client.hubApps', 'Hub de Aplicaciones')}
        </h3>
        <p className={subtitleClass}>
          Explora las soluciones de software especializadas que tenemos disponibles para tu negocio.
        </p>
      </div>

      <div className={gridClass}>
        {apps.map((app, index) => (
          <div 
            key={app.id} 
            className={
              isDark 
                ? "flex flex-col p-8 w-full sm:w-[280px] bg-gray-800/30 backdrop-blur-xl rounded-[2.5rem] border border-gray-600/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] hover:border-blue-500/60 hover:bg-gray-800/60 transition-all duration-500 group animate-float"
                : "flex flex-col p-8 w-full sm:w-[280px] bg-white/10 backdrop-blur-xl rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] hover:border-blue-400 hover:bg-white/20 transition-all duration-500 group animate-float"
            }
            style={{ animationDelay: `${index * 0.6}s` }}
          >
            {app.image ? (
              <div className="w-full h-32 lg:h-36 mb-5 rounded-2xl overflow-hidden relative shadow-lg shadow-black/20">
                <img 
                  src={app.image} 
                  alt={app.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-2 right-2 p-2 rounded-xl backdrop-blur-md bg-black/30 border border-white/10">
                   <app.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            ) : (
              <div className={`p-3 lg:p-4 rounded-xl w-fit ${isDark ? app.darkBgColor : app.bgColor} mb-4 lg:mb-6 group-hover:scale-110 transition-transform`}>
                <app.icon className={`h-6 w-6 lg:h-8 lg:w-8 ${isDark ? app.darkColor : app.color}`} />
              </div>
            )}
            
            <h4 className="text-white font-bold text-xl mb-3">
              {app.name}
            </h4>
            
            <p className="text-white/80 text-sm flex-grow mb-6 line-clamp-3">
              {app.description}
            </p>
            
            <a 
              href={app.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={
                isDark
                  ? "mt-auto flex items-center justify-center w-full px-4 py-2 bg-gray-800 hover:bg-primary-500/20 text-white hover:text-primary-400 border border-gray-600 hover:border-primary-500/50 rounded-lg transition-colors text-sm font-medium"
                  : "mt-auto flex items-center justify-center w-full px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:border-blue-400 transition-colors group-hover:text-blue-100"
              }
            >
              Acceder a la App
              <ArrowRightIcon className="w-4 h-4 lg:w-5 lg:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HubAppsSection;
