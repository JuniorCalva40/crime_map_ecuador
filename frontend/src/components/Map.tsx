import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { useEffect, useState } from 'react';
import { CrimeData } from '../types/globals';
import { Box, LoadingOverlay } from '@mantine/core';
import {
  IconUser,
  IconMapPin,
  IconMapPinOff,
  IconUsers,
} from '@tabler/icons-react';

export interface MapProps {
  filters: {
    ageRange: [number, number];
    gender: string;
    weapon: string;
  };
}

function HeatmapLayer({ data }: { data: [number, number][] }) {
  const map = useMap();
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const [showMarkers, setShowMarkers] = useState(false);

  useEffect(() => {
    const pointsWithIntensity: [number, number, number][] = data.map(
      ([lat, lng]) => [lat, lng, 1]
    );

    const heatLayer = L.heatLayer(pointsWithIntensity, {
      radius: 16,
      blur: 9,
      maxZoom: 13,
      minOpacity: 0.3,
      gradient: {
        0.2: 'blue',
        0.4: 'cyan',
        0.6: 'yellow',
        0.8: 'orange',
        1.0: 'red',
      },
    });

    const newMarkers = data.map(([lat, lng]) => {
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: '<div class="marker-pin bg-red-500 w-3 h-3 rounded-full"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
      });

      marker.bindPopup(`
        <div class="p-2">
          <button class="select-point px-2 py-1 bg-blue-500 text-white rounded-md text-sm">
            Seleccionar
          </button>
        </div>
      `);

      return marker;
    });

    setMarkers(newMarkers);

    map.on('zoomend', () => {
      const currentZoom = map.getZoom();
      setShowMarkers(currentZoom > 13);
    });

    heatLayer.addTo(map);

    return () => {
      heatLayer.remove();
      markers.forEach((marker) => marker.remove());
    };
  }, [data, map]);

  useEffect(() => {
    markers.forEach((marker) => {
      if (showMarkers) {
        marker.addTo(map);
      } else {
        marker.remove();
      }
    });
  }, [showMarkers, markers, map]);

  return null;
}

export default function Map({ filters }: MapProps) {
  const [stats, setStats] = useState({
    total_victims: 0,
    victims_with_coordinates: 0,
    victims_without_coordinates: 0,
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

        const response = await fetch(
          `http://127.0.0.1:8000/crime-data?${params}`
        );
        const data: CrimeData = await response.json();
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
    <Box pos="relative" style={{ height: '100vh', width: '100%' }}>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'myColor', type: 'bars' }}
      />
      <MapContainer
        center={[-1.8312, -78.1834]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {crimeData && <HeatmapLayer data={crimeData.coordinates} />}
        <Leyenda />
        <IncidentInfo
          data={{
            total: stats.total_victims,
            withCoordinates: stats.victims_with_coordinates,
            withoutCoordinates: stats.victims_without_coordinates,
          }}
          isLoading={isLoading}
        />
      </MapContainer>
    </Box>
  );
}

function Leyenda() {
  return (
    <div className="absolute bottom-8 right-8 p-2.5 bg-white rounded-md shadow-lg z-[1000]">
      <div className="text-sm mb-1.5 text-center text-gray-700">
        Intensidad de Incidentes
      </div>
      <div className="w-50 h-5 rounded leaflet-heat-gradient" />
      <div className="flex justify-between text-xs mt-1.5 text-gray-700">
        <span>Bajo</span>
        <span>Alto</span>
      </div>
    </div>
  );
}

function IncidentInfo({
  data,
  isLoading,
}: {
  data: {
    total: number;
    withCoordinates: number;
    withoutCoordinates: number;
  };
  isLoading: boolean;
}) {
  if (isLoading) {
    return null;
  }

  return (
    <div className="absolute top-8 right-8 p-4 bg-white rounded-md shadow-lg z-[1000]">
      <div className="text-sm text-gray-700">
        <div className="flex items-center justify-center gap-2 mb-3">
          <IconUsers size={22} stroke={1.5} />
          <h3 className="font-semibold text-base">Resumen de Incidentes</h3>
        </div>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <IconUser size={18} stroke={1.5} className="text-gray-600" />
            <span className="font-bold">Total:</span>{' '}
            <span className="ml-1">{data.total}</span>
          </li>
          <li className="flex items-center gap-2">
            <IconMapPin size={18} stroke={1.5} className="text-gray-600" />
            <span className="font-bold">Con Coordenadas:</span>{' '}
            <span className="ml-1">{data.withCoordinates}</span>
          </li>
          <li className="flex items-center gap-2">
            <IconMapPinOff size={18} stroke={1.5} className="text-gray-600" />
            <span className="font-bold">Sin Coordenadas:</span>{' '}
            <span className="ml-1">{data.withoutCoordinates}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
