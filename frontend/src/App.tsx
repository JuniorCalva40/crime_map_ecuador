import { Suspense, lazy } from 'react';
import Filters from './components/Filters';

const Map = lazy(() => import('./components/Map'));

export default function App() {
  return (
    <div className="flex flex-col md:flex-row relative">
      <div className="w-full md:w-80 h-auto">
        <Filters />
      </div>
      <div className="w-full flex-1 z-[1]">
        <Suspense
          fallback={
            <div className="w-full h-[calc(100vh-320px)] md:h-screen flex items-center justify-center bg-gray-100">
              <div className="text-lg text-gray-600">Cargando mapa...</div>
            </div>
          }
        >
          <Map />
        </Suspense>
      </div>
    </div>
  );
}
