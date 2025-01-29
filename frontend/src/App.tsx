import { useState, Suspense, lazy } from 'react';
import Filters from './components/Filters';

const Map = lazy(() => import('./components/Map'));

export default function App() {
  const [filters, setFilters] = useState({
    ageRange: [0, 100] as [number, number],
    gender: '',
    weapon: '',
    year: '2024',
  });

  return (
    <div className="flex flex-col md:flex-row relative">
      <div className="hidden md:block md:w-80 h-auto">
        <Filters onFiltersChange={setFilters} />
      </div>
      <div className="w-full flex-1">
        <Suspense
          fallback={
            <div className="w-full h-[calc(100vh-320px)] md:h-screen flex items-center justify-center bg-gray-100">
              <div className="text-lg text-gray-600">Cargando mapa...</div>
            </div>
          }
        >
          <Map filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
