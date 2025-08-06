// Configuración de WhatsApp
export const whatsappConfig = {
  // Número de WhatsApp (formato internacional sin +)
  // Ejemplo: '34612345678' para España
  phoneNumber: '34670835822',
  
  // Mensaje predeterminado que se enviará
  defaultMessage: '¡Hola! Me gustaría agendar una cita para consultar sobre sus servicios de desarrollo web.',
  
  // Mensajes personalizados por servicio (opcional)
  serviceMessages: {
    'desarrollo-web': '¡Hola! Me interesa el servicio de desarrollo web. ¿Podríamos agendar una cita?',
    'aplicaciones-moviles': '¡Hola! Me interesa el desarrollo de aplicaciones móviles. ¿Podríamos agendar una cita?',
    'consultoria-it': '¡Hola! Me interesa la consultoría IT. ¿Podríamos agendar una cita?',
    'cloud-devops': '¡Hola! Me interesa el servicio de Cloud & DevOps. ¿Podríamos agendar una cita?',
    'inteligencia-artificial': '¡Hola! Me interesa el servicio de Inteligencia Artificial. ¿Podríamos agendar una cita?',
    'ciberseguridad': '¡Hola! Me interesa el servicio de Ciberseguridad. ¿Podríamos agendar una cita?',
    'ecommerce': '¡Hola! Me interesa el desarrollo de E-commerce. ¿Podríamos agendar una cita?',
    'marketing-rrss': '¡Hola! Me interesa el marketing en redes sociales. ¿Podríamos agendar una cita?',
    'automatizacion-procesos': '¡Hola! Me interesa la automatización de procesos. ¿Podríamos agendar una cita?',
    'analisis-datos': '¡Hola! Me interesa el análisis de datos y BI. ¿Podríamos agendar una cita?',
    'integracion-sistemas': '¡Hola! Me interesa la integración de sistemas. ¿Podríamos agendar una cita?',
    'apis-microservicios': '¡Hola! Me interesa el desarrollo de APIs y microservicios. ¿Podríamos agendar una cita?'
  }
};

// Función para obtener el mensaje según el servicio actual
export const getWhatsAppMessage = (currentService = null) => {
  if (currentService && whatsappConfig.serviceMessages[currentService]) {
    return whatsappConfig.serviceMessages[currentService];
  }
  return whatsappConfig.defaultMessage;
};

// Función para generar la URL de WhatsApp
export const getWhatsAppUrl = (message = null) => {
  const finalMessage = message || whatsappConfig.defaultMessage;
  const encodedMessage = encodeURIComponent(finalMessage);
  return `https://wa.me/${whatsappConfig.phoneNumber}?text=${encodedMessage}`;
}; 