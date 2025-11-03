'use client';

import {
  Avatar,
  Center,
  Group,
  Skeleton,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  getBadgeProps,
  getPatientSubtitle,
} from '@/shared/components/patient-card';
import { StatusBadge } from '@/shared/components/status';
import RecordModal from '../patient/record-modal';
import { getAllPatients } from './requests';

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
      <Stack px="xl" py="xs" w="100%">
        <PatientSkeleton />
        <PatientSkeleton />
        <PatientSkeleton />
        <PatientSkeleton />
        <PatientSkeleton />
      </Stack>
    );
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
              {getPatientSubtitle(patient)}
            </Text>
          </div>

          {patient.lastTreatmentPlanStatus && (
            <StatusBadge
              status={patient.lastTreatmentPlanStatus}
              getProps={getBadgeProps}
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

function PatientSkeleton() {
  return (
    <Group wrap="nowrap" w="100%">
      <Center>
        <Skeleton height={40} circle />
      </Center>

      <Stack gap="sm" w="100%">
        <Skeleton height={8} radius="xl" width="50%" />
        <Skeleton height={8} radius="xl" width="60%" />
      </Stack>

      <Skeleton height={16} radius="xl" width="20%" />
    </Group>
  );
}
