import { Select, RangeSlider,  Paper, Title, Button, Table, ScrollArea, UnstyledButton, Group, Center, Tooltip } from '@mantine/core';
import {
  IconUsers,
  IconSword,
  IconFilter,
  IconCalendar,
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconInfoCircle
} from '@tabler/icons-react';
import { useState } from 'react';
import { ModalInfo } from './ModalInfo';
import { Provincia } from '../types/globals';
import { useAppContext } from '../context/AppContext';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
  width?: string;
  withInfo?: boolean;
}

function Th({ children, reversed, sorted, onSort, width, withInfo = false }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;

  const title = (
    <Group justify="space-between" wrap="nowrap" gap="xs">
      <Group gap="xs" wrap="nowrap">
        <span className="text-xs sm:text-sm whitespace-nowrap">{children}</span>
        {withInfo && (
          <Tooltip
            multiline
            position="top"
            withArrow
            label={
              <div className="text-xs">
                Número de homicidios por cada 100.000 habitantes.
                <br />
                • Para años hasta 2021: Censo 2010
                <br />
                • Desde 2022: Censo 2022
              </div>
            }
          >
            <IconInfoCircle 
              size="0.9rem" 
              className="text-gray-400 hover:text-gray-200 cursor-help"
            />
          </Tooltip>
        )}
      </Group>
      <Center>
        <Icon size="0.9rem" stroke={1.5} />
      </Center>
    </Group>
  );

  return (
    <Table.Th className='text-gray-200' style={{ width }}>
      <UnstyledButton onClick={onSort} className='w-full'>
        {title}
      </UnstyledButton>
    </Table.Th>
  );
}

export default function Filters() {
  const {setFilters, filters, crimeData} = useAppContext()
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100]);

  const [gender, setGender] = useState<string>('');
  const [weapon, setWeapon] = useState<string>('');
  const [year, setYear] = useState<string>('2024');
  const [sortBy, setSortBy] = useState<'provincia' | 'incidencias' | 'tasa' | null>(null);
  const [reverseSortDir, setReverseSortDir] = useState(false);

  const handleYearChange = (value: string | null) => {
    setYear(value || '');
    setFilters({ ...filters, year: value || '' });
  };

  const handleApplyAgeRange = () => {
    setAgeRange(ageRange);
    setFilters({ ...filters, ageRange: ageRange });
  };

  const handleGenderChange = (value: string | null) => {
    setGender(value || '');
    setFilters({ ...filters, gender: value || '' });
  };

  const handleWeaponChange = (value: string | null) => {
    setWeapon(value || '');
    setFilters({ ...filters, weapon: value || '' });
  };

  const handleProvinceClick = (selectedProvince: string) => {
    const newProvince = filters.province === selectedProvince ? '' : selectedProvince;
    setFilters({ ...filters, province: newProvince });
  };

  const setSorting = (field: 'provincia' | 'incidencias' | 'tasa') => {
    const reversed = field === sortBy ? !reverseSortDir : false;
    setReverseSortDir(reversed);
    setSortBy(field);
  };

  const sortData = (data: Provincia[]) => {
    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      if (sortBy === 'provincia') {
        const compareResult = a.provincia.localeCompare(b.provincia);
        return reverseSortDir ? -compareResult : compareResult;
      }

      const compareResult = a[sortBy] - b[sortBy];
      return reverseSortDir ? -compareResult : compareResult;
    });
  };

  const sortedData = crimeData?.provinces_resumed ? sortData(crimeData.provinces_resumed) : [];

  return (
    <Paper shadow="sm" p="md" className="h-screen max-h-screen" bg="dark.8">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center mb-4">
            <img src="/logo_map.webp" alt="Logo" className="w-10 h-10" />
            <Title order={4} className="text-gray-100">
              Mapa Homicidios Ecuador
            </Title>
          </div>

        <ScrollArea type="scroll" scrollbarSize={8} offsetScrollbars scrollHideDelay={500}>
          <div className="space-y-6 pr-2">
            <Select
              color="myColor"
              value={year}
              onChange={handleYearChange}
              label="Año"
              placeholder="Seleccionar año"
              data={[
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
              leftSection={
                <IconCalendar size="1rem" className="text-gray-400" />
              }
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 block">
                Rango de Edad
              </label>
              <RangeSlider
                color="myColor"
                min={0}
                max={100}
                value={ageRange}
                onChange={setAgeRange}
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

            <div className="space-y-2">
              <ScrollArea.Autosize mah={300} type="scroll" scrollbarSize={8} offsetScrollbars>
                <Table layout="fixed" w="100%" stickyHeader>
                    <Table.Thead>
                      <Table.Tr>
                      <Th
                        sorted={sortBy === 'provincia'}
                        reversed={reverseSortDir}
                        onSort={() => setSorting('provincia')}
                        width="45%"
                      >
                        Prov.
                      </Th>
                      <Th
                        sorted={sortBy === 'incidencias'}
                        reversed={reverseSortDir}
                        onSort={() => setSorting('incidencias')}
                        width="27%"
                      >
                        Total
                      </Th>
                      <Th
                        sorted={sortBy === 'tasa'}
                        reversed={reverseSortDir}
                        onSort={() => setSorting('tasa')}
                        width="28%"
                        withInfo
                      >
                        Tasa
                      </Th>
                      </Table.Tr>
                    </Table.Thead>
                  <Table.Tbody>
                    {sortedData.length > 0 ? (
                      sortedData.map((province) => (
                        <Table.Tr
                          key={province.provincia}
                          bg={filters.province === province.provincia ? 'var(--mantine-color-blue-light)' : undefined}
                          className="cursor-pointer hover:bg-gray-700"
                          onClick={() => handleProvinceClick(province.provincia)}
                        >
                          <Table.Td className='text-gray-200 truncate text-xs sm:text-sm'>
                            {province.provincia}
                          </Table.Td>
                          <Table.Td className='text-gray-200 text-center text-xs sm:text-sm'>
                            {province.incidencias}
                          </Table.Td>
                          <Table.Td className='text-gray-200 text-center text-xs sm:text-sm'>
                            {province.tasa.toFixed(1)}
                          </Table.Td>
                        </Table.Tr>
                      ))
                    ) : (
                      <Table.Tr>
                        <Table.Td colSpan={3} className="text-center text-gray-400 py-4 text-xs sm:text-sm">
                          No se encontraron resultados para los filtros seleccionados
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                  </Table>
              </ScrollArea.Autosize>
          </div>

          </div>
        </ScrollArea>
          
        <div className="mt-auto self-end">
        <ModalInfo />
        </div>
      </div>
    </Paper>
  );
}
