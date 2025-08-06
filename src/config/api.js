// API Configuration
const getAPIURL = () => {
  // Check for environment variable first
  const envURL = import.meta.env.VITE_VOICE_SERVER_API_URL;
  if (envURL) {
    return envURL;
  }

  // Fallback based on environment
  const environment = import.meta.env.MODE || 'development';

  if (environment === 'production') {
    // Replace this with your actual Vercel deployment URL
    // Example: 'https://your-voice-api.vercel.app'
    return 'https://your-voice-api.vercel.app';
  } else {
    // For local development, use localhost
    return 'http://localhost:3000';
  }
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
