import {
  Select,
  RangeSlider,
  Paper,
  Title,
  Stack,
  Button,
} from '@mantine/core';
import {
  IconUsers,
  IconSword,
  IconFilter,
  IconCalendar,
} from '@tabler/icons-react';
import { useState } from 'react';

interface FiltersProps {
  onFiltersChange: (filters: {
    ageRange: [number, number];
    gender: string;
    weapon: string;
    year: string;
  }) => void;
}

export default function Filters({ onFiltersChange }: FiltersProps) {
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100]);
  const [localAgeRange, setLocalAgeRange] = useState<[number, number]>([
    0, 100,
  ]);
  const [gender, setGender] = useState<string>('');
  const [weapon, setWeapon] = useState<string>('');
  const [year, setYear] = useState<string>('2024');

  const handleYearChange = (value: string | null) => {
    setYear(value || '');
    onFiltersChange({ ageRange, gender, weapon, year: value || '' });
  };

  const handleApplyAgeRange = () => {
    setAgeRange(localAgeRange);
    onFiltersChange({ ageRange: localAgeRange, gender, weapon, year });
  };

  const handleGenderChange = (value: string | null) => {
    setGender(value || '');
    onFiltersChange({ ageRange, gender: value || '', weapon, year });
  };

  const handleWeaponChange = (value: string | null) => {
    setWeapon(value || '');
    onFiltersChange({ ageRange, gender, weapon: value || '', year });
  };

  return (
    <Paper shadow="sm" p="md" className="h-full" bg="dark.8">
      <Stack>
        <Title order={3} className="text-gray-100">
          Filtros de Búsqueda
        </Title>

        <div className="space-y-6">
          <Select
            color="myColor"
            value={year}
            onChange={handleYearChange}
            label="Año"
            placeholder="Seleccionar año"
            data={[
              { value: '', label: 'Todos los años' },
              { value: '2014', label: '2014' },
              { value: '2015', label: '2015' },
              { value: '2016', label: '2016' },
              { value: '2017', label: '2017' },
              { value: '2018', label: '2018' },
              { value: '2019', label: '2019' },
              { value: '2020', label: '2020' },
              { value: '2021', label: '2021' },
              { value: '2022', label: '2022' },
              { value: '2023', label: '2023' },
              { value: '2024', label: '2024' },
            ]}
            leftSection={<IconCalendar size="1rem" className="text-gray-400" />}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200 block">
              Rango de Edad
            </label>
            <RangeSlider
              color="myColor"
              min={0}
              max={100}
              value={localAgeRange}
              onChange={setLocalAgeRange}
              marks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 100, label: '100+' },
              ]}
            />
            <div className="w-full mt-4">
              <Button
                size="sm"
                variant="light"
                color="myColor"
                onClick={handleApplyAgeRange}
                leftSection={<IconFilter size={16} />}
                fullWidth
                className="w-full mt-6"
              >
                Aplicar Rango
              </Button>
            </div>
          </div>

          <Select
            color="myColor"
            value={gender}
            onChange={handleGenderChange}
            label="Género"
            placeholder="Seleccionar género"
            data={[
              { value: '', label: 'Todos' },
              { value: 'male', label: 'Hombre' },
              { value: 'female', label: 'Mujer' },
            ]}
            leftSection={<IconUsers size="1rem" className="text-gray-400" />}
          />

          <Select
            color="myColor"
            value={weapon}
            onChange={handleWeaponChange}
            label="Tipo de Arma"
            placeholder="Seleccionar arma"
            data={[
              { value: '', label: 'Todas las armas' },
              { value: 'firearm', label: 'Arma de fuego' },
              { value: 'knife', label: 'Arma blanca' },
              { value: 'constriction', label: 'Constricción' },
              { value: 'others', label: 'Otro tipo' },
            ]}
            leftSection={<IconSword size="1rem" className="text-gray-400" />}
          />
        </div>
      </Stack>
    </Paper>
  );
}
