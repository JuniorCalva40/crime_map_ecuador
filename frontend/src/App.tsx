import { useState } from 'react';
import Map from './components/Map';
import Filters from './components/Filters';

export default function App() {
  const [filters, setFilters] = useState({
    ageRange: [0, 80] as [number, number],
    gender: '',
    weapon: '',
  });

  return (
    <div className="flex">
      <div className="w-80">
        <Filters onFiltersChange={setFilters} />
      </div>
      <div className="flex-1">
        <Map filters={filters} />
      </div>
    </div>
  );
}
