import { Select, RangeSlider, Paper, Title, Stack } from '@mantine/core';
import { IconUsers, IconSword } from '@tabler/icons-react';

export default function Filters() {
  return (
    <Paper shadow="sm" p="md" className="h-full">
      <Stack>
        <Title order={3} className="text-gray-700">
          Filtros de Búsqueda
        </Title>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Rango de Edad
            </label>
            <RangeSlider
              min={18}
              max={80}
              defaultValue={[18, 80]}
              marks={[
                { value: 18, label: '18' },
                { value: 50, label: '50' },
                { value: 80, label: '80+' },
              ]}
              styles={{
                mark: { borderColor: '#228be6' },
                markLabel: { fontSize: '0.8rem' },
              }}
            />
          </div>

          <Select
            label="Género"
            placeholder="Seleccionar género"
            data={[
              { value: '', label: 'Todos' },
              { value: 'male', label: 'Hombre' },
              { value: 'female', label: 'Mujer' },
            ]}
            leftSection={<IconUsers size="1rem" />}
            styles={{ input: { '&:focus': { borderColor: '#228be6' } } }}
          />

          <Select
            label="Tipo de Arma"
            placeholder="Seleccionar arma"
            data={[
              { value: '', label: 'Todas las armas' },
              { value: 'firearm', label: 'Arma de fuego' },
              { value: 'knife', label: 'Arma blanca' },
              { value: 'other', label: 'Otro tipo' },
            ]}
            leftSection={<IconSword size="1rem" />}
            styles={{ input: { '&:focus': { borderColor: '#228be6' } } }}
          />
        </div>
      </Stack>
    </Paper>
  );
}
