import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface HeroSettings {
  title: string;
  subtitle: string;
  imageUrl: string;
}

interface ContactSettings {
  phone: string;
  email: string;
  address: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Service {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
}

interface Settings {
  hero: HeroSettings;
  contact: ContactSettings;
  categories: Category[];
  services: Service[];
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
