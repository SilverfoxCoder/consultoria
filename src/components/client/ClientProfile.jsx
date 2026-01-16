import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon as CheckIconSolid } from '@heroicons/react/20/solid';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

const ClientProfile = () => {
  const { t } = useTranslations();
  const { user, clientId } = useAuth();

  // Estados para datos
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({});
  const [preferences, setPreferences] = useState({});
  const [securitySettings, setSecuritySettings] = useState({});

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const finalClientId = clientId || user?.id || 1;
        const userData = await userService.getUserById(finalClientId);

        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          company: userData.company || '',
          position: userData.position || '',
          address: userData.address || '',
          website: userData.website || '',
          industry: userData.industry || '',
          companySize: userData.companySize || '',
          joinDate: userData.createdAt || ''
        });

        setPreferences(userData.preferences || {
          language: 'es',
          timezone: 'Europe/Madrid',
          currency: 'EUR',
          notifications: {
            email: true,
            sms: false,
            push: true,
            projectUpdates: true,
            budgetAlerts: true,
            supportUpdates: true
          }
        });

        setSecuritySettings(userData.securitySettings || {
          twoFactorEnabled: false,
          lastPasswordChange: '',
          lastLogin: '',
          loginHistory: []
        });
      } catch (err) {
        setError('Error al cargar el perfil');
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, clientId]);

  const languageOptions = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' }
  ];

  const timezoneOptions = [
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
    { value: 'Europe/London', label: 'London (GMT+0)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' }
  ];

  const currencyOptions = [
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'GBP', label: 'British Pound (£)' }
  ];

  const tabs = [
    { id: 'profile', name: t('client.profile'), icon: UserIcon },
    { id: 'preferences', name: t('client.preferences'), icon: CogIcon },
    { id: 'security', name: t('client.security'), icon: ShieldCheckIcon },
    { id: 'notifications', name: t('client.notifications'), icon: BellIcon }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Aquí se guardarían los cambios
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Aquí se cancelarían los cambios
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {t('client.profile')}
            </h1>
            <p className="text-gray-400">
              {t('client.profileSubtitle')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  {t('client.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <CheckIcon className="h-5 w-5 mr-2" />
                  {t('client.save')}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                {t('client.edit')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.fullName')}
                  </label>
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      defaultValue={profileData.name}
                      disabled={!isEditing}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.email')}
                  </label>
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      defaultValue={profileData.email}
                      disabled={!isEditing}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.phone')}
                  </label>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      defaultValue={profileData.phone}
                      disabled={!isEditing}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.company')}
                  </label>
                  <div className="flex items-center space-x-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      defaultValue={profileData.company}
                      disabled={!isEditing}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.position')}
                  </label>
                  <input
                    type="text"
                    defaultValue={profileData.position}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.website')}
                  </label>
                  <input
                    type="url"
                    defaultValue={profileData.website}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('client.address')}
                </label>
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-2" />
                  <textarea
                    rows={3}
                    defaultValue={profileData.address}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.industry')}
                  </label>
                  <input
                    type="text"
                    defaultValue={profileData.industry}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.companySize')}
                  </label>
                  <input
                    type="text"
                    defaultValue={profileData.companySize}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.joinDate')}
                  </label>
                  <input
                    type="date"
                    defaultValue={profileData.joinDate}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.language')}
                  </label>
                  <Listbox value={preferences.language} onChange={() => { }}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <span className="block truncate text-white">
                          {languageOptions.find(option => option.value === preferences.language)?.label}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {languageOptions.map((option) => (
                          <Listbox.Option
                            key={option.value}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-600 text-white' : 'text-gray-300'
                              }`
                            }
                            value={option.value}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {option.label}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-400">
                                    <CheckIconSolid className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.timezone')}
                  </label>
                  <Listbox value={preferences.timezone} onChange={() => { }}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <span className="block truncate text-white">
                          {timezoneOptions.find(option => option.value === preferences.timezone)?.label}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {timezoneOptions.map((option) => (
                          <Listbox.Option
                            key={option.value}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-600 text-white' : 'text-gray-300'
                              }`
                            }
                            value={option.value}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {option.label}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-400">
                                    <CheckIconSolid className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.currency')}
                  </label>
                  <Listbox value={preferences.currency} onChange={() => { }}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <span className="block truncate text-white">
                          {currencyOptions.find(option => option.value === preferences.currency)?.label}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {currencyOptions.map((option) => (
                          <Listbox.Option
                            key={option.value}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-600 text-white' : 'text-gray-300'
                              }`
                            }
                            value={option.value}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {option.label}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-400">
                                    <CheckIconSolid className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">{t('client.twoFactorAuth')}</h4>
                    <p className="text-sm text-gray-400">{t('client.twoFactorAuthDesc')}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${securitySettings.twoFactorEnabled
                        ? 'text-green-400 bg-green-400/10'
                        : 'text-red-400 bg-red-400/10'
                      }`}>
                      {securitySettings.twoFactorEnabled ? t('client.enabled') : t('client.disabled')}
                    </span>
                    <button className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm transition-colors">
                      {securitySettings.twoFactorEnabled ? t('client.disable') : t('client.enable')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.lastPasswordChange')}
                  </label>
                  <div className="flex items-center space-x-3">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-white">{securitySettings.lastPasswordChange}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('client.lastLogin')}
                  </label>
                  <span className="text-white">{securitySettings.lastLogin}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-3">{t('client.loginHistory')}</h4>
                <div className="space-y-2">
                  {securitySettings.loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-sm text-white">{login.device}</p>
                        <p className="text-xs text-gray-400">{login.ip}</p>
                      </div>
                      <span className="text-xs text-gray-400">{login.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {Object.entries(preferences.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        {t(`client.${key}`)}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {t(`client.${key}Desc`)}
                      </p>
                    </div>
                    <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-primary-600' : 'bg-gray-600'
                      }`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile; 