import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Función para determinar el tipo de usuario
const getUserType = (email) => {
  if (!email) return 'client';
  // Cambia el dominio según tu empresa
  return email.endsWith('@codexcore.com') ? 'admin' : 'client';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('client');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un usuario guardado en localStorage al cargar la app
  useEffect(() => {
    const verifyStoredAuth = async () => {
      const savedUser = localStorage.getItem('codethics_user');
      const savedToken = localStorage.getItem('codethics_token');
      const savedUserType = localStorage.getItem('codethics_userType');
      
      if (savedUser && savedToken) {
        try {
          const userData = JSON.parse(savedUser);
          
          // Verificar si el token sigue siendo válido
          const isValid = await userService.verifyAuth(savedToken);
          
          if (isValid) {
            setUser(userData);
            setIsAuthenticated(true);
            setUserType(savedUserType || getUserType(userData.email));
          } else {
            // Token inválido, limpiar datos
            logout();
          }
        } catch (error) {
          console.error('Error verifying stored auth:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyStoredAuth();
  }, []);

  const login = (authData) => {
    const { user: userData, token } = authData;
    const type = getUserType(userData.email);
    
    console.log('🔑 AuthContext: Login exitoso para usuario:', userData);
    console.log('  ID:', userData.id);
    console.log('  Email:', userData.email);
    console.log('  Tipo:', type);
    
    // Guardar en localStorage
    localStorage.setItem('codethics_user', JSON.stringify(userData));
    localStorage.setItem('codethics_token', token);
    localStorage.setItem('codethics_userType', type);
    // Actualizar estado
    setUser(userData);
    setIsAuthenticated(true);
    setUserType(type);
    return true;
  };

  const logout = async () => {
    const token = localStorage.getItem('codethics_token');
    
    // Intentar cerrar sesión en el backend
    if (token) {
      try {
        await userService.logout(token);
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    // Limpiar localStorage
    localStorage.removeItem('codethics_user');
    localStorage.removeItem('codethics_token');
    localStorage.removeItem('codethics_userType');
    // Actualizar estado
    setUser(null);
    setIsAuthenticated(false);
    setUserType('client');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('codethics_user', JSON.stringify(userData));
    // Actualizar userType si cambia el email
    setUserType(getUserType(userData.email));
    localStorage.setItem('codethics_userType', getUserType(userData.email));
  };

  // Login con Google OAuth
  const loginWithGoogle = async (googleUserData) => {
    try {
      console.log('🟢 AuthContext: Iniciando login con Google');
      
      // Intentar autenticación con usuario existente
      const authService = await import('../services/authService');
      let authData;
      
      try {
        authData = await authService.default.googleAuth(googleUserData);
        console.log('✅ AuthContext: Usuario existente autenticado con Google');
      } catch (error) {
        // Si el usuario no existe, intentar registro automático
        console.log('📝 AuthContext: Usuario no existe, registrando automáticamente');
        authData = await authService.default.googleRegister(googleUserData);
        console.log('✅ AuthContext: Usuario registrado y autenticado con Google');
      }
      
      // Procesar el login
      const loginSuccess = login(authData);
      
      if (loginSuccess) {
        console.log('🎉 AuthContext: Login con Google completado exitosamente');
        return { success: true, isNewUser: !authData.existingUser };
      }
      
      return { success: false, error: 'Error procesando la autenticación' };
      
    } catch (error) {
      console.error('❌ AuthContext: Error en login con Google:', error);
      return { 
        success: false, 
        error: error.message || 'Error al autenticar con Google' 
      };
    }
  };

  const value = {
    user,
    userType,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 