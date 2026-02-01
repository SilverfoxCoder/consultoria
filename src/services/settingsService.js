// Service for handling application settings
// Currently uses localStorage, but can be easily swapped for an API implementation

const SETTINGS_KEY = 'consultoria_settings';

const defaultSettings = {
  integrations: {
    whatsapp: '+34 670 83 58 22',
    calendly: 'https://calendly.com/xperienciaconsulting', // Default placeholder
    apiKey: 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzY4MDYzODI1LCJqdGkiOiI3ZGVjZjJiNC0zZTNkLTQ3ZjAtODNhMy0wNzYwODQwNzgzNjMiLCJ1c2VyX3V1aWQiOiI2NjAzNjk2YS1jYThkLTRhOGItYWFhZC1lOTFmNWY2MGQxYWIifQ.v9EAEh-3r0lahkkirM9Mwd3q9egpz-Eop8lL_Wyr3ZspayNc7zFNp6No21lsHPHYPjbF-diubz1W48jdk_dO7w',
    clientId: 'Jfz9iV_K8NoMx7oZu76HbGF15iQ2eTNS6WkVmlMLj9E',
    webhook: 'zdSWGIVBKiTG5QxfdkB5s4iL_MyusCMf4ymHOUlWvDA '
  },
  company: {
    name: 'XperiecIA Consulting',
    address: 'C/ Madre Teresa de Calcuta, 11, 16410, Horcajo de Santiago, Cuenca',
    phone: '+34 670 83 58 22',
    email: 'info@xperiecia.com',
    website: 'https://www.xperiecia.com'
  }
};

class SettingsService {
  constructor() {
    this.storageKey = SETTINGS_KEY;
  }

  // Get all settings
  getSettings() {
    try {
      const storedSettings = localStorage.getItem(this.storageKey);
      if (!storedSettings) {
        return defaultSettings;
      }
      
      const parsedSettings = JSON.parse(storedSettings);
      
      
      // Deep merge for integrations and company to preserve defaults
      const mergedIntegrations = {
        ...defaultSettings.integrations,
        ...(parsedSettings.integrations || {})
      };

      // Fallback for empty or invalid Calendly URL in storage
      if (!mergedIntegrations.calendly || mergedIntegrations.calendly === 'https://calendly.com/') {
        mergedIntegrations.calendly = defaultSettings.integrations.calendly;
      }

      return {
        ...defaultSettings,
        ...parsedSettings,
        integrations: mergedIntegrations,
        company: {
          ...defaultSettings.company,
          ...(parsedSettings.company || {})
        }
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  }

  // Save all settings
  saveSettings(settings) {
    try {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(this.storageKey, JSON.stringify(newSettings));
      return newSettings;
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  // Get specific section
  getSection(section) {
    const settings = this.getSettings();
    return settings[section] || {};
  }

  // Update specific section
  updateSection(section, data) {
    const settings = this.getSettings();
    settings[section] = { ...settings[section], ...data };
    return this.saveSettings(settings);
  }

  // Get integration config
  getIntegration(name) {
    const integrations = this.getSection('integrations');
    return integrations[name] || '';
  }

  // Fetch Calendly URL using API Key
  async fetchCalendlyUrl(apiKey) {
    if (!apiKey) throw new Error('API Key is required');

    try {
      const response = await fetch('https://api.calendly.com/users/me', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info from Calendly');
      }

      const data = await response.json();
      return data.resource.scheduling_url;
    } catch (error) {
      console.error('Error fetching Calendly URL:', error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService();
