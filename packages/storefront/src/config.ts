// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function to get full API endpoint
export const getApiUrl = (endpoint: string) => `${API_URL}${endpoint}`;

// Get image URL with fallback
export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '/placeholder.svg';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_URL}${imageUrl}`;
};

