import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getApiUrl } from '../config';

interface Settings {
  shopName: string;
  shopTagline: string;
  shopEmail: string;
  shopPhone: string;
  shopAddress: string;
  shopWebsite: string;
  currency: string;
  currencySymbol: string;
  logoUrl: string;
  // Storefront specific settings (from StoreInfo)
  storeName?: string;
  storeTagline?: string;
  storePhone?: string;
  storeEmail?: string;
  storeAddress?: string;
  storeAbout?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

const defaultSettings: Settings = {
  shopName: 'ElectroHub',
  shopTagline: 'Your Electronics Partner',
  shopEmail: 'contact@electrohub.com',
  shopPhone: '+1 (555) 123-4567',
  shopAddress: '123 Tech Street, Digital City',
  shopWebsite: 'www.electrohub.com',
  currency: 'USD',
  currencySymbol: '$',
  logoUrl: '/logo.svg',
};

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch main settings from admin dashboard settings
        const [settingsRes, storeInfoRes] = await Promise.all([
          fetch(getApiUrl('/api/settings')),
          fetch(getApiUrl('/api/storefront/store-info')),
        ]);

        const mainSettings = settingsRes.ok ? await settingsRes.json() : {};
        const storeInfo = storeInfoRes.ok ? await storeInfoRes.json() : {};

        setSettings({
          ...defaultSettings,
          ...mainSettings,
          ...storeInfo,
        });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

export type { Settings };

