import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  FolderIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import LanguageSelector from '../LanguageSelector';
import NotificationBadge from '../common/NotificationBadge';
import { useAuth } from '../../contexts/AuthContext';

const ClientLayout = ({ children, onBack, currentSection, onSectionChange }) => {
  const { t } = useTranslations();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: t('client.dashboard'), href: 'dashboard', icon: HomeIcon },
    { name: t('client.budgets'), href: 'budgets', icon: DocumentTextIcon },
    { name: t('client.services'), href: 'services', icon: WrenchScrewdriverIcon },
    { name: t('client.projects'), href: 'projects', icon: FolderIcon },
    { name: t('client.support'), href: 'support', icon: ExclamationTriangleIcon },
    { name: t('client.analytics'), href: 'analytics', icon: ChartBarIcon },
    { name: t('client.profile'), href: 'profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-white">Xperiecia</h1>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    <span className="text-gray-300 text-sm">|</span>
                    <span className="text-gray-400 text-sm">{t('client.portal')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <NotificationBadge />
              <LanguageSelector />
              <button
                onClick={() => {
                  logout();
                  onBack();
                }}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                {t('client.logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="lg:hidden">
        <div className={`fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-gray-900 border-r border-gray-700">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">{t('client.menu')}</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onSectionChange(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors ${currentSection === item.href
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gray-900 border-r border-gray-700 pt-16">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => onSectionChange(item.href)}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors ${currentSection === item.href
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-16">
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientLayout; 