// API Configuration
// Change this URL to your backend server URL when deploying

// For local development
// export const API_URL = 'http://localhost:3001';

// For production - Update this with your Railway/Render backend URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function to get full API endpoint
export const getApiUrl = (endpoint: string) => `${API_URL}${endpoint}`;

