import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Services from './components/Services';

import Contact from './components/Contact';
import Footer from './components/Footer';
import TechBackground from './components/TechBackground';
import Login from './components/Login';
import RegisterModal from './components/auth/RegisterModal';
import Dashboard from './components/Dashboard';
import ClientPortal from './components/client/ClientPortal';
import WhatsAppButton from './components/WhatsAppButton';
import ToastContainer from './components/common/ToastContainer';

// Service Components
import DesarrolloWeb from './components/services/DesarrolloWeb';
import AplicacionesMoviles from './components/services/AplicacionesMoviles';
import ConsultoriaIT from './components/services/ConsultoriaIT';
import CloudDevOps from './components/services/CloudDevOps';
import InteligenciaArtificial from './components/services/InteligenciaArtificial';
import Ciberseguridad from './components/services/Ciberseguridad';
import Ecommerce from './components/services/Ecommerce';
import MarketingRRSS from './components/services/MarketingRRSS';
import AutomatizacionProcesos from './components/services/AutomatizacionProcesos';
import AnalisisDatos from './components/services/AnalisisDatos';
import IntegracionSistemas from './components/services/IntegracionSistemas';
import APIsMicroservicios from './components/services/APIsMicroservicios';
import OpenAPITester from './components/OpenAPITester';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showClientPortal, setShowClientPortal] = useState(false);
  const { isAuthenticated, isLoading, login, userType } = useAuth();

  // Scroll to top when navigating to service pages
  useEffect(() => {
    if (currentPage !== 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Mostrar dashboard automáticamente si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      // Cerrar todos los modales y mostrar dashboard apropiado
      setShowLogin(false);
      setShowRegister(false);
      
      if (userType === 'admin') {
        setShowDashboard(true);
        setShowClientPortal(false);
      } else {
        setShowClientPortal(true);
        setShowDashboard(false);
      }
    }
  }, [isAuthenticated, userType]);

  const handleNavClick = (page) => {
    if (page === 'contact') {
      // Navegar a home y hacer scroll a la sección de contacto
      setCurrentPage('home');
      setShowLogin(false);
      setShowDashboard(false);
      setShowClientPortal(false);
      
      // Hacer scroll a la sección de contacto después de que se renderice
      setTimeout(() => {
        const contactSection = document.getElementById('contacto');
        if (contactSection) {
          contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      setCurrentPage(page);
      setShowLogin(false);
      setShowDashboard(false);
      setShowClientPortal(false);
    }
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
    setShowDashboard(false);
    setShowClientPortal(false);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
    setShowDashboard(false);
    setShowClientPortal(false);
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
    setShowLogin(false);
    setShowRegister(false);
    setShowClientPortal(false);
  };



  const handleLoginSuccess = (authData) => {
    login(authData);
    setShowLogin(false);
    setShowRegister(false);
    // Redirigir según el tipo de usuario
    if (userType === 'admin') {
      setShowDashboard(true);
    } else {
      setShowClientPortal(true);
    }
  };

  const handleRegisterSuccess = (authData) => {
    // Opcional: Auto-login después del registro
    // Por ahora, solo cerramos el modal y mostramos mensaje de éxito
    setShowRegister(false);
    
    // Mostrar el modal de login para que el usuario inicie sesión
    setTimeout(() => {
      setShowLogin(true);
    }, 500); // Pequeño delay para mejor UX
  };

  const handleBackToHome = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowDashboard(false);
    setShowClientPortal(false);
    setCurrentPage('home');
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Show login page
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-900">
        <TechBackground />
        <Login onLogin={handleLoginSuccess} onBack={handleBackToHome} />
      </div>
    );
  }

  // Show register page
  if (showRegister) {
    return (
      <div className="min-h-screen bg-gray-900">
        <TechBackground />
        <div className="relative">
          <Navbar 
            onNavClick={handleNavClick} 
            currentPage={currentPage}
            onShowLogin={handleShowLogin}
            onShowRegister={handleShowRegister}
            onShowDashboard={handleShowDashboard}
          />
          <RegisterModal 
            onClose={() => setShowRegister(false)}
            onLoginClick={handleShowLogin}
            onRegisterSuccess={handleRegisterSuccess}
          />
        </div>
      </div>
    );
  }

  // Show dashboard
  if (showDashboard && isAuthenticated) {
    if (userType !== 'admin') {
      // Si no es admin, redirigir a cliente
      setShowDashboard(false);
      setShowClientPortal(true);
      return null;
    }
    return (
      <div className="min-h-screen bg-gray-900">
        <TechBackground />
        <Dashboard onBack={handleBackToHome} />
      </div>
    );
  }
  // Show client portal
  if (showClientPortal && isAuthenticated) {
    if (userType !== 'client') {
      // Si no es cliente, redirigir a admin
      setShowClientPortal(false);
      setShowDashboard(true);
      return null;
    }
    return (
      <div className="min-h-screen bg-gray-900">
        <TechBackground />
        <ClientPortal onBack={handleBackToHome} />
      </div>
    );
  }

  // Main application
  return (
    <div className="min-h-screen bg-gray-900">
      <TechBackground />
      <Navbar 
        onNavClick={handleNavClick} 
        currentPage={currentPage}
        onShowLogin={handleShowLogin}
        onShowRegister={handleShowRegister}
        onShowDashboard={handleShowDashboard}
      />
      
      <main className="pt-16">
        {currentPage === 'home' && (
          <>
            <Home 
              onShowRegister={handleShowRegister}
              onShowDashboard={handleShowDashboard}
              onShowServices={() => handleNavClick('services')}
            />
            <Services onServiceClick={handleNavClick} />
            <Contact />
          </>
        )}
        
        {/* Service Pages */}
        {currentPage === 'desarrollo-web' && <DesarrolloWeb />}
        {currentPage === 'aplicaciones-moviles' && <AplicacionesMoviles />}
        {currentPage === 'consultoria-it' && <ConsultoriaIT />}
        {currentPage === 'cloud-devops' && <CloudDevOps />}
        {currentPage === 'inteligencia-artificial' && <InteligenciaArtificial />}
        {currentPage === 'ciberseguridad' && <Ciberseguridad />}
        {currentPage === 'ecommerce' && <Ecommerce />}
        {currentPage === 'marketing-rrss' && <MarketingRRSS />}
        {currentPage === 'automatizacion-procesos' && <AutomatizacionProcesos />}
        {currentPage === 'analisis-datos' && <AnalisisDatos />}
        {currentPage === 'integracion-sistemas' && <IntegracionSistemas />}
        {currentPage === 'apis-microservicios' && <APIsMicroservicios />}
        {currentPage === 'openapi-tester' && <OpenAPITester />}
      </main>
      
      <Footer />
      <WhatsAppButton currentService={currentPage} />
      <ToastContainer />
    </div>
  );
};

const App = () => {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  
  if (!googleClientId) {
    console.warn('⚠️ Google Client ID no está configurado. La autenticación con Google no estará disponible.');
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || "demo-client-id"}>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
};

export default App; 