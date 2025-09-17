import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Card,
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlus,
  IconCalendarClock,
  IconDental,
  IconNotebook,
  IconEdit,
} from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { TreatmentPlan, ProcedureShort } from '@/shared/models';
import classes from './procedure-card.module.css';
import ProcedureSectionModal from './procedure-modal';

interface ProcedureSectionProps {
  treatmentPlanId: string;
  queryOptions: UseQueryOptions<TreatmentPlan, Error, TreatmentPlan, string[]>;
}

export default function ProcedureSection({
  queryOptions,
  treatmentPlanId,
}: ProcedureSectionProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedProcedure, setSelectedProcedure] = useState<
    ProcedureShort | undefined
  >();

  const { data, isLoading } = useQuery({
    ...queryOptions,
    select: (data) => ({
      procedures: data.procedures,
    }),
  });

  function handleClose() {
    close();
    setSelectedProcedure(undefined);
  }

  return (
    <Card shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={700} size="lg">
            Procedimentos do plano
          </Text>
          <ActionIcon variant="subtle" color="gray" onClick={open}>
            <IconPlus size={16} />
          </ActionIcon>
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm">
        {isLoading || !data ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : (
          <Stack gap="sm">
            {data.procedures
              .slice()
              .sort((a, b) => a.plannedSession - b.plannedSession)
              .map((p) => (
                <ProcedureCard
                  key={p.id}
                  data={p}
                  open={open}
                  setSelectedProcedure={setSelectedProcedure}
                />
              ))}
          </Stack>
        )}
      </Card.Section>
      <ProcedureSectionModal
        treatmentPlanId={treatmentPlanId}
        queryOptions={queryOptions}
        opened={opened}
        open={open}
        close={handleClose}
        selectedProcedure={selectedProcedure}
      />
    </Card>
  );
}

export interface ProcedureCardData {
  id: string;
  name: string;
  tooth: string[];
  studySector: string;
  plannedSession: number;
  notes: string;
  status: 'draft' | 'not_started' | 'in_progress' | 'in_review' | 'done';
}

interface ProcedureCardProps {
  data: ProcedureShort;
  open: () => void;
  setSelectedProcedure: (data: ProcedureShort) => void;
}

const statusLabels: Record<
  ProcedureShort['status'],
  { title: string; color: string }
> = {
  draft: {
    title: 'Rascunho',
    color: 'gray',
  },
  not_started: {
    title: 'Não iniciado',
    color: 'gray',
  },
  in_progress: {
    title: 'Em andamento',
    color: 'blue',
  },
  in_review: {
    title: 'Em revisão',
    color: 'yellow',
  },
  done: {
    title: 'Concluído',
    color: 'green',
  },
};

function getProcedureCardData(data: ProcedureShort): ProcedureCardData {
  return {
    id: data.id,
    name: data.name,
    plannedSession: data.plannedSession,
    studySector: data.studySector,
    tooth: data.teeth,
    status: data.status,
    notes: data.notes,
  };
}

function ProcedureCard({
  data,
  open,
  setSelectedProcedure,
}: ProcedureCardProps) {
  const { id, name, tooth, studySector, plannedSession, notes, status } =
    getProcedureCardData(data);

  function handleEdit() {
    open();
    setSelectedProcedure(data);
  }

  return (
    <Card shadow="sm" padding="none" radius="md" withBorder>
      <Group gap={0}>
        <Group p="lg" gap={4}>
          <IconCalendarClock size={20} color="gray" />
          <Text size="md" c="dimmed">
            {plannedSession}
          </Text>
        </Group>

        <Stack p="md" gap="sm" className={classes.root}>
          <Group justify="space-between" align="center">
            <Text fw={600}>
              {name}{' '}
              <Text span c="dimmed" fw={600}>
                #{id}
              </Text>
            </Text>
            <Group gap="sm">
              <Badge variant="light" color={statusLabels[status].color}>
                {statusLabels[status].title}
              </Badge>
              <ActionIcon variant="subtle" color="gray" onClick={handleEdit}>
                <IconEdit size={16} color="gray" />
              </ActionIcon>
            </Group>
          </Group>

          {notes && (
            <Text size="sm" c="dimmed">
              {notes}
            </Text>
          )}

          <Group gap="md">
            {/* <Group gap={4}>
                  <IconHash size={16} color="gray" />
                  <Text size="xs" c="dimmed">
                    {plannedSession}
                  </Text>
                </Group> */}
            <Group gap={4}>
              <IconDental size={16} color="gray" />
              <Text size="sm" c="dimmed">
                {tooth.join(', ')}
              </Text>
            </Group>
            <Group gap={4}>
              <IconNotebook size={16} color="gray" />
              <Text size="sm" c="dimmed">
                {studySector}
              </Text>
            </Group>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}
