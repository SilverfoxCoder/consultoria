import React from 'react';


const LegalNotice = () => {


  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="container-max py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 lg:p-12">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-600 mb-4">
              Aviso Legal
            </h1>
            <p className="text-gray-600 text-lg">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">

            {/* Información de la empresa */}
            <section>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">1. Información de la Empresa</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="mb-2"><strong>Razón Social:</strong> XperiecIA Consulting </p>
                <p className="mb-2"><strong>NIF:</strong> B-49054881</p>
                <p className="mb-2"><strong>Domicilio Social:</strong> Madre Teresa de Calcuta 11, Horcajo de Santiago, Cuenca</p>
                <p className="mb-2"><strong>Email:</strong> experienciaitservices@gmail.com</p>
                <p className="mb-2"><strong>Teléfono:</strong> +34 670 83 58 22</p>
              </div>
            </section>

            {/* Objeto de la empresa */}
            <section>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">2. Objeto de la Empresa</h2>
              <p>
                XperiecIA Consulting es una empresa de consultoría tecnológica especializada en:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Desarrollo de software y aplicaciones web</li>
                <li>Consultoría en tecnologías de la información</li>
                <li>Servicios de cloud computing y DevOps</li>
                <li>Implementación de soluciones de inteligencia artificial</li>
                <li>Servicios de ciberseguridad</li>
                <li>Integración de sistemas empresariales</li>
                <li>Formación y capacitación tecnológica</li>
              </ul>
            </section>

            {/* Condiciones de uso */}
            <section>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">3. Condiciones de Uso</h2>
              <p>
                El acceso y uso de este sitio web implica la aceptación expresa y sin reservas de todas las condiciones y términos incluidos en este Aviso Legal.
              </p>
              <p className="mt-4">
                Los usuarios se comprometen a utilizar el sitio web de conformidad con la ley, la moral, las buenas costumbres y el orden público.
              </p>
            </section>

            {/* Propiedad intelectual */}
            <section>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">4. Propiedad Intelectual</h2>
              <p>
                Todos los contenidos de este sitio web, incluyendo textos, fotografías, gráficos, imágenes, iconos, tecnología, enlaces, contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente, son propiedad intelectual de XperiencIA Consulting S.L. o de terceros, sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotación reconocidos por la normativa vigente en materia de propiedad intelectual.
              </p>
              <p className="mt-4">
                Queda expresamente prohibida la reproducción, distribución, comunicación pública y transformación, total o parcial, de los contenidos de este sitio web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización previa y por escrito de XperiencIA Consulting S.L.
              </p>
            </section>

            {/* Responsabilidad */}
            <section>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">5. Responsabilidad</h2>
              <p>
                XperiecIA Consulting no se hace responsable de los daños y perjuicios que se pudieran derivar de interferencias, omisiones, interrupciones, informáticos, averías telefónicas o desconexiones en el funcionamiento operativo del sistema electrónico, motivadas por causas ajenas a la empresa.
              </p>
              <p className="mt-4">
                Asimismo, la empresa no garantiza la ausencia de virus u otros elementos que puedan causar alteraciones en los sistemas informáticos, documentos electrónicos o ficheros de los usuarios de este sitio web.
              </p>
            </section>

            {/* Protección de datos */}
            <section>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">6. Protección de Datos</h2>
              <p>
                En cumplimiento de lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos, se informa que:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Responsable del tratamiento:</strong> XperiecIA Consulting</li>
                <li><strong>Finalidad:</strong> Gestión de consultas, prestación de servicios y envío de comunicaciones comerciales</li>
                <li><strong>Legitimación:</strong> Consentimiento del interesado y ejecución de contratos</li>
                <li><strong>Destinatarios:</strong> No se ceden datos a terceros, salvo obligación legal</li>
                <li><strong>Derechos:</strong> Acceso, rectificación, supresión, limitación, portabilidad y oposición</li>
                <li><strong>Conservación:</strong> Los datos se conservarán mientras se mantenga la relación comercial</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">7. Política de Cookies</h2>
              <p>
                Este sitio web utiliza cookies propias y de terceros para mejorar la experiencia del usuario y analizar el tráfico web. Puede obtener más información sobre nuestra política de cookies en nuestra Política de Privacidad.
              </p>
            </section>

            {/* Legislación aplicable */}
            <section>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">8. Legislación Aplicable</h2>
              <p>
                Las presentes condiciones se rigen por la legislación española. Para cualquier litigio que pudiera surgir relacionado con el sitio web o la actividad que en él se desarrolla serán competentes los Juzgados y Tribunales de Madrid, salvo que la ley establezca otra jurisdicción obligatoria.
              </p>
            </section>

            {/* Modificaciones */}
            <section>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">9. Modificaciones</h2>
              <p>
                XperiecIA Consulting se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su sitio web, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se prestan a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su sitio web.
              </p>
            </section>

            {/* Contacto */}
            <section>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">10. Contacto</h2>
              <p>
                Para cualquier consulta relacionada con este Aviso Legal, puede contactar con nosotros a través de:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="mb-2"><strong>Email:</strong> experienciaitservices@gmail.com</p>
                <p className="mb-2"><strong>Teléfono:</strong> +34 670 83 58 22</p>
                <p className="mb-2"><strong>Dirección:</strong> Madre Teresa de Calcuta 11, Horcajo de Santiago, Cuenca</p>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} XperiecIA Consulting. Todos los derechos reservados.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
