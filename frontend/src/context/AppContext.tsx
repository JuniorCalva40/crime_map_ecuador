import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { CrimeData } from '../types/globals';
import { getCrimeDataFilteredByParams } from '../services';

interface Stats {
  total_victims: number;
  victims_with_coordinates: number;
  victims_without_coordinates: number;
}

interface Filters {
  ageRange: [number, number];
  gender: string;
  province: string;
  weapon: string;
  year: string;
}

interface AppContextType {
  stats: Stats;
  crimeData: CrimeData | null;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<Stats>({
    total_victims: 0,
    victims_with_coordinates: 0,
    victims_without_coordinates: 0,
  });
  const [filters, setFilters] = useState({
    ageRange: [0, 100] as [number, number],
    gender: '',
    province: '',
    weapon: '',
    year: '2024',
  });

  const [crimeData, setCrimeData] = useState<CrimeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        params.append('age_min', filters.ageRange[0].toString());
        params.append('age_max', filters.ageRange[1].toString());
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.weapon) params.append('weapon', filters.weapon);
        if (filters.province) params.append('province', filters.province);
        if (filters.year) params.append('year', filters.year);
        const data: CrimeData = await getCrimeDataFilteredByParams(params)
        setCrimeData(data);
        setStats(data.statistics);
        
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <AppContext.Provider value={{ 
      stats, 
      crimeData, 
      filters,
      setFilters,
      isLoading 
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }

  return context;
};