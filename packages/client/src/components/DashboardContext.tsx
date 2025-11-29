import { createContext, useState } from 'react';

interface DashboardContextType {
  dateRange: string;
  setDateRange: (value: string) => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [dateRange, setDateRange] = useState('monthly');

  return (
    <DashboardContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DashboardContext.Provider>
  );
}
