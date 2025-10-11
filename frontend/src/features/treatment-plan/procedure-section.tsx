'use client';

import {
  ActionIcon,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconExclamationCircle, IconPlus } from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useState } from 'react';

import ProcedureCard from '@/shared/components/procedure-card';
import { Mode, ProcedureShort, TreatmentPlan } from '@/shared/models';
import ProcedureSectionModal from './procedure-modal';

interface ProcedureSectionProps {
  treatmentPlanId: string;
  queryOptions: UseQueryOptions<TreatmentPlan, Error, TreatmentPlan, string[]>;
  mode: Mode;
}

export default function ProcedureSection({
  queryOptions,
  treatmentPlanId,
  mode,
}: ProcedureSectionProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedProcedure, setSelectedProcedure] = useState<
    ProcedureShort | undefined
  >();

  const {
    data: procedures,
    isLoading,
    isError,
  } = useQuery({
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
          {mode === 'edit' && (
            <ActionIcon variant="subtle" color="gray" onClick={open}>
              <IconPlus size={16} />
            </ActionIcon>
          )}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm">
        <ProcedureSectionContent
          procedures={procedures}
          isLoading={isLoading}
          isError={isError}
          mode={mode}
          handleProcedureEdit={handleProcedureEdit}
          handleProcedureDelete={handleProcedureDelete}
        />
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

interface ProcedureSectionContentProps {
  procedures?: ProcedureShort[];
  isLoading: boolean;
  isError: boolean;
  mode: Mode;
  handleProcedureEdit: (procedure: ProcedureShort) => void;
  handleProcedureDelete: (procedure: ProcedureShort) => void;
}

export function ProcedureSectionContent(props: ProcedureSectionContentProps) {
  const { procedures, isError, isLoading } = props;

  if (isLoading) {
    return (
      <Center py="md">
        <Loader size="sm" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Flex align="center" gap="xs">
        <ThemeIcon variant="white" color="red">
          <IconExclamationCircle size={24} />
        </ThemeIcon>
        <Text size="sm" c="red" py="none">
          Erro ao carregar procedimentos do plano
        </Text>
      </Flex>
    );
  }

  if (!procedures) {
    return null;
  }

  if (procedures.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center">
        Nenhum procedimento adicionado
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      {procedures
        .slice()
        .sort((a, b) => a.plannedSession - b.plannedSession)
        .map((p) => (
          <ProcedureCard
            key={p.id}
            procedure={p}
            onEdit={props.handleProcedureEdit}
            onDelete={props.handleProcedureDelete}
            mode={props.mode}
          />
        ))}
    </Stack>
  );
}
