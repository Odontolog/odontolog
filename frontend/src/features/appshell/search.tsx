'use client';

import {
  ActionIcon,
  Avatar,
  Badge,
  Center,
  Code,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getAllPatients } from '@/features/patient/requests';
import styles from './navbar.module.css';

export default function Search() {
  const [query, setQuery] = useState('');

  return (
    <>
      <UnstyledButton
        onClick={spotlight.open}
        style={{ width: 300 }}
        visibleFrom="md"
      >
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

      <ActionIcon
        onClick={spotlight.open}
        variant="default"
        size="lg"
        aria-label="Pesquisar pacientes"
        color="gray"
        hiddenFrom="md"
      >
        <IconSearch />
      </ActionIcon>

      <Spotlight.Root
        query={query}
        onQueryChange={setQuery}
        shortcut={['mod + K', 'mod + P', '/']}
      >
        <Spotlight.Search
          placeholder="Buscar por Paciente..."
          leftSection={<IconSearch size={20} stroke={1.5} />}
        />
        <SearchContent query={query} />
      </Spotlight.Root>
    </>
  );
}

function SearchContent({ query }: { query: string }) {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['patientsSearch'],
    queryFn: getAllPatients,
  });

  if (isLoading || data === undefined) {
    return (
      <Stack p="xs" gap="sm" w={250} align="center">
        <Loader size="sm" />
      </Stack>
    );
  }

  function getBadgeProps(status: string) {
    switch (status) {
      case 'finished':
        return { color: 'gray', children: 'ENCERRADO' };
      case 'in_progress':
        return { color: 'teal', children: 'PLANO ABERTO' };
      default:
        return { color: 'indigo', children: 'NÃO INICIADO' };
    }
  }

  const patients = data
    .filter((patient) =>
      patient.name.toLowerCase().includes(query.toLowerCase().trim()),
    )
    .map((patient) => (
      <Spotlight.Action
        key={patient.name}
        onClick={() => router.push(`/patients/${patient.id}/procedures`)}
      >
        <Group wrap="nowrap" w="100%">
          {patient.avatarUrl && (
            <Center>
              <Avatar
                src={patient?.avatarUrl}
                name={patient.name}
                color="initials"
              />
            </Center>
          )}

          <div style={{ flex: 1 }}>
            <Text>{patient.name}</Text>

            <Text c="dimmed" size="xs">
              Última modificação{' '}
              <b>
                {patient.updatedAt.toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </b>{' '}
              por <b>{patient.assignee.name}</b>
            </Text>
          </div>

          {patient.status && (
            <Badge variant="light" {...getBadgeProps(patient.status)} />
          )}
        </Group>
      </Spotlight.Action>
    ));

  return (
    <Spotlight.ActionsList>
      {patients.length > 0 ? (
        patients.slice(0, 7)
      ) : (
        <Spotlight.Empty onClick={() => console.log('Criar novo prontuário')}>
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
  );
}
