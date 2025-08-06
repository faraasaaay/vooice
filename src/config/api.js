// API Configuration
const getAPIURL = () => {
  // Hardcoded API URL - Update this with your deployed voice server API URL
  return 'https://your-voice-server-api.vercel.app';
  
  // For local development, uncomment the line below and comment the line above
  // return 'http://localhost:3000';
};

// Export the API URL
export const API_URL = getAPIURL();

// Helper function to get the full socket URL
export const getSocketURL = () => {
  return API_URL;
};

// Export configuration object for backward compatibility
export const API_CONFIG = {
  API_URL: API_URL
};

export default API_CONFIG;
