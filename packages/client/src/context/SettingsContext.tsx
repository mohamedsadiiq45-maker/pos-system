import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  shopName: string;
  shopTagline: string;
  shopEmail: string;
  shopPhone: string;
  shopAddress: string;
  shopWebsite: string;
  currency: string;
  currencySymbol: string;
  taxRate: string;
  taxEnabled: string;
  receiptFooter: string;
  lowStockThreshold: string;
  logoUrl: string;
}

const defaultSettings: Settings = {
  shopName: 'Super Electronics',
  shopTagline: 'Your Electronics Partner',
  shopEmail: 'contact@superelectronics.com',
  shopPhone: '+253 77 00 00 00',
  shopAddress: 'Djibouti City, Djibouti',
  shopWebsite: 'www.superelectronics.com',
  currency: 'DJF',
  currencySymbol: 'DJF',
  taxRate: '0',
  taxEnabled: 'false',
  receiptFooter: 'Thank you for shopping with us!',
  lowStockThreshold: '10',
  logoUrl: '/logo.svg',
};

interface SettingsContextType {
  settings: Settings;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  refreshSettings: async () => {},
  updateSettings: () => {},
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/settings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  useEffect(() => {
    // Only fetch if user is logged in
    if (localStorage.getItem('token')) {
      fetchSettings();
    }
  }, []);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

export type { Settings };

