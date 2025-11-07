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
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useForm, type UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconExclamationCircle } from '@tabler/icons-react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useState } from 'react';

import PatientConditionCard from '@/features/anamnese/ui/condition-card';
import {
  Anamnese,
  AnamneseFormValues,
  ConditionFormValue,
  PatientCondition,
} from '../models';
import { saveAnamnese } from '../requests';

const CATEGORY_MAP: { [key: string]: string } = {
  MEDICAL: 'História Médica',
  FEMALE: 'Saúde Feminina',
  HABITS: 'Hábitos e Vícios',
};

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
    enabled: true,
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

function AnamneseSectionContent(props: AnamneseSectionContent) {
  const {
    patientId,
    conditions,
    isError,
    isLoading,
    editing,
    setEditing,
    queryOptions,
  } = props;

  const initialConditions: AnamneseFormValues = {
    conditions: [],
  };

  if (conditions) {
    initialConditions.conditions = conditions.map((condition, index) => ({
      formIndex: index,
      ...condition,
    }));
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (anamnese: AnamneseFormValues) =>
      saveAnamnese(patientId, anamnese),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryOptions.queryKey,
      });
      setEditing(false);
    },
    onError: (error) => {
      notifications.show({
        title: 'Não foi possível salvar os dados',
        message: `Um erro inesperado aconteceu e não foi possível salvar suas alterações . Tente novamente mais tarde. ${error}`,
        color: 'red',
        icon: <IconExclamationCircle />,
        autoClose: 5000,
      });
    },
  });

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
    mutation.reset();
  }

  function handleSubmit(values: AnamneseFormValues) {
    mutation.mutate(values);
  }

  const groupedConditions = Object.groupBy(
    form.getValues().conditions,
    (condition) => condition.category,
  );

  const categories = ['MEDICAL', 'FEMALE', 'HABITS'];

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack mb="md">
        {categories.map((category, index) => (
          <AnamneseCategorySection
            key={index}
            category={CATEGORY_MAP[category]}
            conditions={groupedConditions[category]}
            editing={editing}
            form={form}
          />
        ))}
      </Stack>
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
            <Button type="submit" loading={mutation.isPending}>
              Salvar
            </Button>
          </Group>
        </Flex>
      )}
    </form>
  );
}

interface AnamneseCategorySectionProps {
  category: string;
  conditions?: ConditionFormValue[];
  form: UseFormReturnType<AnamneseFormValues>;
  editing: boolean;
}

function AnamneseCategorySection(props: AnamneseCategorySectionProps) {
  return (
    <Stack w="100%" gap="xs">
      <Text fw={500}>{props.category}</Text>
      <Grid gutter="xs">
        {props.conditions
          ? props.conditions
              .sort((a, b) =>
                a.description
                  .toLowerCase()
                  .localeCompare(b.description.toLowerCase()),
              )
              .map((condition) => (
                <Grid.Col
                  span={{ md: 12, lg: 6, xl: 4 }}
                  key={condition.formIndex}
                >
                  <PatientConditionCard
                    index={condition.formIndex}
                    title={condition.description}
                    form={props.form}
                    editing={props.editing}
                  />
                </Grid.Col>
              ))
          : 'Não foi possível carregar esse formulário.'}
      </Grid>
    </Stack>
  );
}
