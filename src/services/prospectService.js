import { API_CONFIG } from '../config/api';

/**
 * Service for managing prospects (leads found by the bot).
 */
class ProspectService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.headers = API_CONFIG.HEADERS;
  }

  /**
   * Helper method for making requests with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('xperiecia_token');
    
    try {
      const response = await fetch(url, {
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // If content-type is json, parse it
      const result = await response.text();
      try {
          return result ? JSON.parse(result) : {};
      } catch (e) {
          return result;
      }
    } catch (error) {
      console.error('ProspectService Error:', error);
      throw error;
    }
  }

  /**
   * Get all prospects
   * GET /api/prospects
   */
  async getProspects() {
    return this.request('/prospects');
  }

  /**
   * Trigger manual search for a city
   * POST /api/prospects/search/trigger?city={city}
   */
  async triggerSearch(city) {
    const queryParams = new URLSearchParams({ city });
    return this.request(`/prospects/search/trigger?${queryParams}`, {
      method: 'POST'
    });
  }
}

const prospectService = new ProspectService();
export { prospectService };
export default prospectService;
