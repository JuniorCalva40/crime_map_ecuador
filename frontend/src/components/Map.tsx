import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { Box, LoadingOverlay } from '@mantine/core';
import {
  IconUser,
  IconMapPin,
  IconMapPinOff,
  IconUsers,
} from '@tabler/icons-react';
import { CrimeData } from '../types/globals';

export interface MapProps {
  filters: {
    ageRange: [number, number];
    gender: string;
    weapon: string;
    year: string;
  };
}

interface IncidentDetail {
  motivation: string;
  weapon_type: string;
  probable_cause: string;
  date: string;
  gender: string;
  age: number;
}

interface PopupDetails {
  details: IncidentDetail[];
}

const createLoadingPopupContent = () => `
  <div class="p-3">
    <div class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
    </div>
  </div>
`;

const HeatmapLayer = React.memo(
  ({
    data,
    onPointSelect,
  }: {
    data: [number, number][];
    onPointSelect?: (coordinates: [number, number]) => void;
  }) => {
    const map = useMap();
    const [markers, setMarkers] = useState<L.Marker[]>([]);

    useEffect(() => {
      const heatLayer = L.heatLayer(
        data.map(([lat, lng]) => [lat, lng, 1]),
        {
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
        }
      );

      heatLayer.addTo(map);

      // Crear marcadores
      const newMarkers = data.map(([lat, lng]) => {
        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: '<div class="marker-pin bg-red-500 w-3 h-3 rounded-full"></div>',
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          }),
        });

        marker.on('click', async (e) => {
          L.DomEvent.stopPropagation(e);

          const popup = L.popup()
            .setLatLng([lat, lng])
            .setContent(createLoadingPopupContent())
            .openOn(map);

          try {
            const response = await fetch(
              `http://localhost:8000/crime-data/details-by-location?latitude=${lat}&longitude=${lng}`
            );
            if (!response.ok) throw new Error('Network response was not ok');
            const details = await response.json();
            popup.setContent(createPopupContent(details));
          } catch (error) {
            console.error('Error:', error);
            popup.setContent(
              '<div class="p-3 text-red-500">Error al cargar los detalles</div>'
            );
          }
        });

        return marker;
      });

      setMarkers(newMarkers);

      // Manejar zoom
      const updateMarkers = () => {
        const zoom = map.getZoom();
        newMarkers.forEach((marker) => {
          if (zoom > 11) {
            marker.addTo(map);
          } else {
            marker.remove();
          }
        });
      };

      map.on('zoomend', updateMarkers);
      updateMarkers();

      return () => {
        heatLayer.remove();
        newMarkers.forEach((marker) => marker.remove());
        map.off('zoomend', updateMarkers);
      };
    }, [data, map, onPointSelect]);

    return null;
  }
);

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
        if (filters.year) params.append('year', filters.year);

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
            <span className="font-bold">Total víctimas: {data.total}</span>
          </li>
          <li className="flex items-center gap-2">
            <IconMapPin size={18} stroke={1.5} className="text-green-500" />
            <span>Con coordenadas: {data.withCoordinates}</span>
          </li>
          <li className="flex items-center gap-2">
            <IconMapPinOff size={18} stroke={1.5} className="text-yellow-500" />
            <span>Sin coordenadas: {data.withoutCoordinates}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

const createPopupContent = (details: PopupDetails): string => {
  return `
    <div class="p-3">
      <div class="mb-3 text-sm font-semibold text-gray-700">
        Total de incidentes: ${details.details.length}
      </div>
      ${details.details
        .map(
          (incident: IncidentDetail, index: number) => `
          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <div class="mb-2 font-semibold text-blue-600 border-b pb-1">
              Incidente #${index + 1}
            </div>
            <div class="space-y-1.5">
              <div class="flex items-center gap-2 text-sm">
                <span class="font-medium">Fecha:</span>
                <span>${new Date(incident.date).toLocaleDateString(
                  'es-ES'
                )}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="font-medium">Género:</span>
                <span>${incident.gender.toLowerCase()}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="font-medium">Edad:</span>
                <span>${
                  incident.age === 0 ? 'No definido' : `${incident.age} años`
                }</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="font-medium">Motivación:</span>
                <span>${incident.motivation.toLowerCase()}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="font-medium">Tipo de arma:</span>
                <span>${incident.weapon_type.toLowerCase()}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="font-medium">Causa probable:</span>
                <span>${incident.probable_cause.toLowerCase()}</span>
              </div>
            </div>
          </div>
        `
        )
        .join('')}
    </div>
  `;
};
