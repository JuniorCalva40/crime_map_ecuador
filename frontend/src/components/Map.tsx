import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { useEffect, useMemo, useState } from 'react';

function HeatmapLayer({ data }: { data: [number, number][] }) {
  const map = useMap();

  const heatLayer = useMemo(() => {
    const pointsWithIntensity: [number, number, number][] = data.map(
      ([lat, lng]) => [lat, lng, 1]
    );

    return L.heatLayer(pointsWithIntensity, {
      radius: 15,
      blur: 5,
      maxZoom: 16,
      minOpacity: 0.3,
      gradient: {
        0.2: 'blue',
        0.4: 'cyan',
        0.6: 'yellow',
        0.8: 'orange',
        1.0: 'red',
      },
    });
  }, [data]);

  useEffect(() => {
    heatLayer.addTo(map);
    return () => {
      heatLayer.remove();
    };
  }, [map, heatLayer]);

  return null;
}

export default function Map() {
  const [pointsCrime, setPointsCrime] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/crime-data/');
        const data = await response.json();
        setPointsCrime(data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <MapContainer
      center={[-1.8312, -78.1834]}
      zoom={7}
      className="rounded-r-3xl"
      scrollWheelZoom={true}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatmapLayer data={pointsCrime} />
      <Leyenda />
    </MapContainer>
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
