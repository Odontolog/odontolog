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

import {
  TreatmentPlan,
  ProcedureShort,
  ProcedureStatus,
} from '@/shared/models';
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

  const { data: procedures, isLoading } = useQuery({
    ...queryOptions,
    select: (data) => data.procedures,
  });

  function handleClose() {
    close();
    setSelectedProcedure(undefined);
  }

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Procedimentos do plano
          </Text>
          <ActionIcon variant="subtle" color="gray" onClick={open}>
            <IconPlus size={16} />
          </ActionIcon>
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm">
        {isLoading || !procedures ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : (
          <Stack gap="sm">
            {procedures
              .slice()
              .sort((a, b) => a.plannedSession - b.plannedSession)
              .map((p) => (
                <ProcedureCard
                  key={p.id}
                  procedure={p}
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
  status: ProcedureStatus;
}

interface ProcedureCardProps {
  procedure: ProcedureShort;
  open: () => void;
  setSelectedProcedure: (procedure: ProcedureShort) => void;
}

const statusLabels: Record<ProcedureStatus, { title: string; color: string }> =
  {
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

function ProcedureCard({
  procedure,
  open,
  setSelectedProcedure,
}: ProcedureCardProps) {
  function handleEdit() {
    open();
    setSelectedProcedure(procedure);
  }

  return (
    <Card shadow="sm" padding="none" radius="md" withBorder>
      <Group gap={0}>
        <Group p="lg" gap={4}>
          <IconCalendarClock size={20} color="gray" />
          <Text size="md" c="dimmed">
            {procedure.plannedSession}
          </Text>
        </Group>

        <Stack p="md" gap="sm" className={classes.root}>
          <Group justify="space-between" align="center">
            <Text fw={600}>
              {procedure.name}{' '}
              <Text span c="dimmed" fw={600}>
                #{procedure.id}
              </Text>
            </Text>
            <Group gap="sm">
              <Badge
                variant="light"
                color={statusLabels[procedure.status].color}
              >
                {statusLabels[procedure.status].title}
              </Badge>
              <ActionIcon variant="subtle" color="gray" onClick={handleEdit}>
                <IconEdit size={16} color="gray" />
              </ActionIcon>
            </Group>
          </Group>

          {procedure.notes && (
            <Text size="sm" c="dimmed">
              {procedure.notes}
            </Text>
          )}

          <Group gap="md">
            <Group gap={4}>
              <IconDental size={16} color="gray" />
              <Text size="sm" c="dimmed">
                {procedure.teeth.join(', ')}
              </Text>
            </Group>
            <Group gap={4}>
              <IconNotebook size={16} color="gray" />
              <Text size="sm" c="dimmed">
                {procedure.studySector}
              </Text>
            </Group>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}
