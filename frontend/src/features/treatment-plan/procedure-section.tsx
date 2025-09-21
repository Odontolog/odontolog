import {
  ActionIcon,
  Card,
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useState } from 'react';

import ProcedureCard from '@/shared/components/procedure-card';
import { ProcedureShort, TreatmentPlan } from '@/shared/models';
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

  function handleProcedureEdit(procedure: ProcedureShort) {
    open();
    setSelectedProcedure(procedure);
  }

  function handleProcedureDelete(procedure: ProcedureShort) {
    console.log(`handle delete of ${procedure.name}`);
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
                  onEdit={handleProcedureEdit}
                  onDelete={handleProcedureDelete}
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
