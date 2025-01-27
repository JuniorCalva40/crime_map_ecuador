import { useDisclosure } from '@mantine/hooks';
import { Accordion, Button, Modal, Stack, Textarea } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface InfoItem {
  title: string;
  content: string | JSX.Element;
}

const info: InfoItem[] = [
  {
    title: '¿De donde procede los datos?',
    content: (
      <>
        Son extraídos de{' '}
        <span className="text-blue-500 hover:underline">
          <a
            href="https://www.datosabiertos.gob.ec/dataset/homicidios-intencionales"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.datosabiertos.gob.ec/dataset/homicidios-intencionales
          </a>
        </span>{' '}
        y fueron recopilados estadísticamente en el Ecuador, a partir de
        información proporcionada por el Ministerio del Interior.
      </>
    ),
  },
  {
    title: 'Años cubiertos en los datos',
    content:
      'El conjunto de datos cubre los años 2014-2024, con actualizaciones anuales basadas en reportes oficiales.',
  },
  {
    title: 'Como colaborar en el proyecto',
    content: (
      <>
        Si quieres colaborar en el proyecto, puedes hacerlo en el siguiente{' '}
        <span className="text-blue-500 hover:underline">
          <a
            href="https://github.com/JuniorCalva40/crime_map_ecuador"
            target="_blank"
            rel="noopener noreferrer"
          >
            enlace
          </a>
        </span>{' '}
        o
        <FormSuggestion />
      </>
    ),
  },
];

export function ModalInfo() {
  const [opened, { open, close }] = useDisclosure(false);

  const items = info.map((item: InfoItem) => (
    <Accordion.Item key={item.title} value={item.title}>
      <Accordion.Control
        icon={<IconInfoCircle className="text-blue-400" />}
        className="hover:bg-gray-800/50 transition-colors duration-200"
      >
        {item.title}
      </Accordion.Control>
      <Accordion.Panel className="leading-relaxed text-gray-300">
        {item.content}
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <>
      <Modal
        size="lg"
        zIndex={1000}
        opened={opened}
        onClose={close}
        title="Información"
        centered
        classNames={{
          title: 'text-xl font-semibold text-gray-100 mb-2',
          body: 'p-4',
        }}
      >
        <Stack>
          <div className="flex justify-center items-start gap-4 bg-gray-800/50 p-6 rounded-lg">
            <img
              className="w-12 h-12 object-contain"
              src="/logo_map.webp"
              alt="Logo"
            />
            <p className="text-gray-300 leading-relaxed">
              Este proyecto tiene como objetivo visualizar de manera interactiva
              la distribución geográfica de los homicidios en Ecuador
            </p>
          </div>

          <Accordion variant="separated">{items}</Accordion>
        </Stack>
      </Modal>

      <span
        onClick={open}
        className="cursor-pointer self-end hover:text-blue-400 transition-colors duration-200 text-gray-300"
      >
        <IconInfoCircle size="25" />
      </span>
    </>
  );
}

function FormSuggestion() {
  return (
    <form
      action="https://formsubmit.co/juniorcalva43@gmail.com"
      method="POST"
      className="flex flex-col gap-4 mt-4"
    >
      <Textarea
        placeholder="Escribe tu sugerencia o idea"
        className="focus:border-blue-400"
        minRows={3}
      />
      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
      >
        Enviar
      </Button>
    </form>
  );
}
