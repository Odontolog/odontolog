'use client';

import {
  ActionIcon,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEdit, IconExclamationCircle } from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useState } from 'react';

import PatientConditionCard from '@/features/anamnese/ui/condition-card';
import { Anamnese, PatientCondition } from '@/shared/models';

interface AnamneseSectionProps {
  patientId: string;
  queryOptions: UseQueryOptions<Anamnese, Error, Anamnese, string[]>;
}

export default function AnamneseSection(props: AnamneseSectionProps) {
  const { patientId, queryOptions } = props;
  const [editing, setEditing] = useState(false);

  const {
    data: conditions,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => data.conditions,
    enabled: false,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" flex="1">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Anamnese
          </Text>
          {!editing && (
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled={isLoading || isError}
              onClick={() => setEditing(true)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          )}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section
        inheritPadding
        px="md"
        py="sm"
        flex="1"
        h="100%"
        style={{ overflowY: 'hidden' }}
      >
        <AnamneseSectionContent
          patientId={patientId}
          queryOptions={queryOptions}
          isError={isError}
          isLoading={isLoading}
          editing={editing}
          conditions={conditions}
          setEditing={setEditing}
        />
      </Card.Section>
    </Card>
  );
}

interface AnamneseSectionContent extends AnamneseSectionProps {
  conditions?: PatientCondition[];
  isLoading: boolean;
  isError: boolean;
  editing: boolean;
  setEditing: (value: boolean) => void;
}

type ConditionFormValue = {
  notes: string;
  hasCondition: boolean;
};

export type AnamneseFormValues = {
  conditions: ConditionFormValue[];
};

function AnamneseSectionContent(props: AnamneseSectionContent) {
  const { conditions, isError, isLoading, editing, setEditing } = props;

  const initialConditions: AnamneseFormValues = {
    conditions:
      conditions === undefined
        ? []
        : conditions.map((condition) => ({
            notes: condition.notes,
            hasCondition: condition.hasCondition,
          })),
  };

  const form = useForm<AnamneseFormValues>({
    mode: 'uncontrolled',
    initialValues: initialConditions,
  });

  if (isLoading) {
    return (
      <Center py="md">
        <Loader size="sm" />
      </Center>
    );
  }

  if (isError || conditions === undefined || conditions.length === 0) {
    return (
      <Flex align="center" gap="xs">
        <ThemeIcon variant="white" color="red">
          <IconExclamationCircle size={24} />
        </ThemeIcon>
        <Text size="sm" c="red" py="none">
          Erro ao carregar formulário de anamnese do paciente
        </Text>
      </Flex>
    );
  }

  function handleCancel() {
    setEditing(false);
    form.reset();
    // mutation.reset();
  }

  const fields = form.getValues().conditions.map((_, index) => (
    <Grid.Col span={{ md: 12, lg: 6, xl: 4 }} key={conditions[index].id}>
      <PatientConditionCard
        index={index}
        condition={conditions[index].condition}
        form={form}
        editing={editing}
      />
    </Grid.Col>
  ));

  return (
    <>
      <Grid gutter="xs">{fields}</Grid>
      {editing && (
        <Flex
          justify="space-between"
          align="center"
          direction="row-reverse"
          mt="sm"
        >
          <Group gap="xs">
            <Button variant="default" fw="normal" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
            // onClick={() => mutation.mutate(displayValue)}
            // loading={mutation.isPending}
            >
              Salvar
            </Button>
          </Group>
        </Flex>
      )}
    </>
  );
}
