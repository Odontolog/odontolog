'use client';

import {
  Avatar,
  Badge,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getAllPatients } from './requests';
import RecordModal from '../patient/record-modal';

export default function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState('');
  const [recordModalOpened, setRecordModalOpened] = useState(false);

  return (
    <>
      {children}
      <Spotlight.Root
        query={query}
        onQueryChange={setQuery}
        shortcut={['mod + K', 'mod + P', '/']}
      >
        <Spotlight.Search
          placeholder="Buscar por Paciente..."
          leftSection={<IconSearch size={20} stroke={1.5} />}
        />
        <SearchContent
          query={query}
          onCreateRecord={() => {
            spotlight.close();
            setRecordModalOpened(true);
          }}
        />
      </Spotlight.Root>
      <RecordModal
        opened={recordModalOpened}
        onClose={() => setRecordModalOpened(false)}
      />
    </>
  );
}

function SearchContent({
  query,
  onCreateRecord,
}: {
  query: string;
  onCreateRecord: () => void;
}) {
  const router = useRouter();
  // TODO: Adicionar search query, mas apenas com Debounce
  const { data, isLoading } = useQuery({
    queryKey: ['patientsSearch'],
    queryFn: async () => await getAllPatients(),
  });

  if (isLoading || data === undefined) {
    return (
      <Stack p="xl" gap="sm" align="center" w="100%">
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
          <Center>
            <Avatar
              src={patient?.avatarUrl}
              name={patient.name}
              color="initials"
            />
          </Center>

          <div style={{ flex: 1 }}>
            <Text>{patient.name}</Text>

            <Text c="dimmed" size="xs">
              Última modificação{' '}
              <b>
                {patient.lastTreatmentPlanUpdatedAt.toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </b>
            </Text>
          </div>

          {patient.lastTreatmentPlanStatus && (
            <Badge
              variant="light"
              {...getBadgeProps(patient.lastTreatmentPlanStatus)}
            />
          )}
        </Group>
      </Spotlight.Action>
    ));

  return (
    <Spotlight.ActionsList>
      {patients.length > 0 ? (
        patients.slice(0, 7)
      ) : (
        <Spotlight.Empty onClick={onCreateRecord}>
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
