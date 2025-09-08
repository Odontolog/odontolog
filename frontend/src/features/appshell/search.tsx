'use client';
import { useState } from 'react';
import { Spotlight, spotlight } from '@mantine/spotlight';
import {
  Avatar,
  Badge,
  Center,
  Code,
  Group,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

import styles from './navbar.module.css';

const data = [
  {
    id: 1,
    image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    name: 'Bender Bending Rodríguez',
    lastModified: new Date(),
    assignee: 'Jéssica Pereira',
    status: 'not started',
  },
  {
    id: 2,
    image: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
    name: 'Homer Simpson',
    lastModified: new Date(Date.now() - 86400000),
    assignee: 'Carlos Silva',
    status: 'open',
  },
  {
    id: 3,
    image: 'https://img.icons8.com/clouds/256/000000/marge-simpson.png',
    name: 'Marge Simpson',
    lastModified: new Date(Date.now() - 2 * 86400000),
    assignee: 'Ana Souza',
    status: 'closed',
  },
  {
    id: 4,
    image: 'https://img.icons8.com/clouds/256/000000/bart-simpson.png',
    name: 'Bart Simpson',
    lastModified: new Date(Date.now() - 3 * 86400000),
    assignee: 'Pedro Lima',
    status: 'not started',
  },
  {
    id: 5,
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    name: 'Carol Miller',
    lastModified: new Date(Date.now() - 4 * 86400000),
    assignee: 'Mariana Costa',
    status: 'open',
  },
  {
    id: 6,
    image: 'https://img.icons8.com/clouds/256/000000/maggie-simpson.png',
    name: 'Maggie Simpson',
    lastModified: new Date(Date.now() - 5 * 86400000),
    assignee: 'João Oliveira',
    status: 'closed',
  },
  {
    id: 7,
    image: 'https://img.icons8.com/clouds/256/000000/futurama-leela.png',
    name: 'Turanga Leela',
    lastModified: new Date(Date.now() - 6 * 86400000),
    assignee: 'Fernanda Dias',
    status: 'open',
  },
];

export default function Search() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const getBadgeProps = (status: string) => {
    switch (status) {
      case 'closed':
        return { color: 'gray', children: 'ENCERRADO' };
      case 'open':
        return { color: 'teal', children: 'PLANO ABERTO' };
      default:
        return { color: 'indigo', children: 'NÃO INICIADO' };
    }
  };

  const patients = data
    .filter((patient) =>
      patient.name.toLowerCase().includes(query.toLowerCase().trim()),
    )
    .map((patient) => (
      <Spotlight.Action
        key={patient.name}
        onClick={() => router.push(`/patients/${patient.id}`)}
      >
        <Group wrap="nowrap" w="100%">
          {patient.image && (
            <Center>
              <Avatar src={patient?.image} name={patient.name} color="initials" />
            </Center>
          )}

          <div style={{ flex: 1 }}>
            <Text>{patient.name}</Text>

            <Text c="dimmed" size="xs">
              Última modificação{' '}
              <b>
                {patient.lastModified.toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </b>{' '}
              por <b>{patient.assignee}</b>
            </Text>
          </div>

          {patient.status && (
            <Badge variant="light" {...getBadgeProps(patient.status)} />
          )}
        </Group>
      </Spotlight.Action>
    ));

  return (
    <>
      <UnstyledButton onClick={spotlight.open} style={{ width: 300 }}>
        <TextInput
          readOnly
          placeholder="Buscar por Paciente..."
          size="sm"
          leftSection={<IconSearch size={14} stroke={1.5} />}
          rightSectionWidth={70}
          rightSection={<Code className={styles.searchCode}>Ctrl + K</Code>}
          style={{ cursor: 'pointer', pointerEvents: 'none' }}
        />
      </UnstyledButton>

      <Spotlight.Root
        query={query}
        onQueryChange={setQuery}
        shortcut={['mod + K', 'mod + P', '/']}
      >
        <Spotlight.Search
          placeholder="Buscar por Paciente..."
          leftSection={<IconSearch size={20} stroke={1.5} />}
        />
        <Spotlight.ActionsList>
          {patients.length > 0 ? (
            patients.slice(0, 7)
          ) : (
            <Spotlight.Empty
              onClick={() => console.log('Criar novo prontuário')}
            >
              <UnstyledButton
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <IconPlus size={24} color="var(--mantine-color-gray-8)" />
                <div>
                  <Text size="md" c="black">
                    Nenhum paciente foi encontrado
                  </Text>
                  <Text size="xs" c="dimmed">
                    Clique para criar um novo prontuário.
                  </Text>
                </div>
              </UnstyledButton>
            </Spotlight.Empty>
          )}
        </Spotlight.ActionsList>
      </Spotlight.Root>
    </>
  );
}
