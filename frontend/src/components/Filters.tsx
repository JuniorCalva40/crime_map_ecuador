import {
  Select,
  RangeSlider,
  Paper,
  Title,
  Stack,
  Button,
} from '@mantine/core';
import { IconUsers, IconSword, IconFilter } from '@tabler/icons-react';
import { useState } from 'react';

interface FiltersProps {
  onFiltersChange: (filters: {
    ageRange: [number, number];
    gender: string;
    weapon: string;
  }) => void;
}

export default function Filters({ onFiltersChange }: FiltersProps) {
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 80]);
  const [localAgeRange, setLocalAgeRange] = useState<[number, number]>([0, 80]);
  const [gender, setGender] = useState<string>('');
  const [weapon, setWeapon] = useState<string>('');

  const handleApplyAgeRange = () => {
    setAgeRange(localAgeRange);
    onFiltersChange({ ageRange: localAgeRange, gender, weapon });
  };

  const handleGenderChange = (value: string | null) => {
    setGender(value || '');
    onFiltersChange({ ageRange, gender: value || '', weapon });
  };

  const handleWeaponChange = (value: string | null) => {
    setWeapon(value || '');
    onFiltersChange({ ageRange, gender, weapon: value || '' });
  };

  return (
    <Paper shadow="sm" p="md" className="h-full" bg="dark.8">
      <Stack>
        <Title order={3} className="text-gray-100">
          Filtros de Búsqueda
        </Title>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200 block">
              Rango de Edad
            </label>
            <RangeSlider
              color="myColor"
              min={0}
              max={80}
              value={localAgeRange}
              onChange={setLocalAgeRange}
              marks={[
                { value: 0, label: '0' },
                { value: 40, label: '40' },
                { value: 80, label: '80+' },
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
              { value: 'other', label: 'Otro tipo' },
            ]}
            leftSection={<IconSword size="1rem" className="text-gray-400" />}
          />
        </div>
      </Stack>
    </Paper>
  );
}
