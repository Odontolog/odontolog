'use client';

import {
  Button,
  Flex,
  Group,
  Modal,
  MultiSelect,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';

import { procedureNames, studySectors, teeth } from '@/shared/data';
import { ProcedureShort, TreatmentPlan } from '@/shared/models';
import { ProcedureFormValues } from './models';
import {
  createTreatmentPlanProcedure,
  editTreatmentPlanProcedure,
} from './requests';

interface ProcedureSectionModalProps {
  treatmentPlanId: string;
  queryOptions: UseQueryOptions<TreatmentPlan, Error, TreatmentPlan, string[]>;
  opened: boolean;
  open: () => void;
  close: () => void;
  selectedProcedure?: ProcedureShort;
}

export default function ProcedureSectionModal(
  props: ProcedureSectionModalProps,
) {
  return (
    <>
      <Modal.Root opened={props.opened} onClose={props.close} size="lg">
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Stack gap="0" style={{ flex: 1 }}>
              <Group>
                <Modal.Title fw="600">Adicionar novo procedimento</Modal.Title>
                <Modal.CloseButton />
              </Group>
              <Text size="sm" c="dimmed">
                Para adicionar um novo procedimento ao plano, preencha os campos
                abaixo.
              </Text>
            </Stack>
          </Modal.Header>
          <Modal.Body>
            <ProcedureSectionModalForm {...props} />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

function ProcedureSectionModalForm({
  treatmentPlanId,
  queryOptions,
  close,
  selectedProcedure,
}: ProcedureSectionModalProps) {
  const queryClient = useQueryClient();

  const initialValues: ProcedureFormValues = {
    name: '',
    teeth: [],
    plannedSession: undefined,
    studySector: '',
  };

  let mutationFn = createTreatmentPlanProcedure;

  if (selectedProcedure) {
    initialValues.name = selectedProcedure.name;
    initialValues.teeth = selectedProcedure.teeth;
    initialValues.plannedSession = selectedProcedure.plannedSession;
    initialValues.studySector = selectedProcedure.studySector;

    mutationFn = editTreatmentPlanProcedure;
  }

  const mutation = useMutation({
    mutationFn: (procedure: ProcedureFormValues) =>
      mutationFn(treatmentPlanId, procedure),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryOptions.queryKey,
      });
      close();
    },
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues,
    validate: {
      plannedSession: (value) =>
        value !== undefined && isNaN(value)
          ? 'A sessão planejada deve ser um número.'
          : null,
    },
  });

  function handleSubmit(values: ProcedureFormValues) {
    if (selectedProcedure) {
      values.id = selectedProcedure.id;
    }
    mutation.mutate(values);
  }

  const displayStudySectors = studySectors?.length
    ? studySectors
    : [initialValues.studySector];

  const displayProcedureNames = procedureNames?.length
    ? procedureNames
    : [initialValues.name];

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack gap="sm">
        <Select
          label="Selecione o tipo do Procedimento"
          placeholder="Selecione uma opção"
          data={displayProcedureNames}
          searchable
          required
          key={form.key('name')}
          {...form.getInputProps('name')}
          nothingFoundMessage="Nenhum procedimento encontrado..."
        />

        <MultiSelect
          label="Selecione o(s) dente(s) ou região(ões) relacionadas"
          placeholder="Selecione uma opção"
          required
          data={teeth}
          key={form.key('teeth')}
          {...form.getInputProps('teeth')}
        />

        <Group grow align="start">
          <TextInput
            label="Sessão planejada"
            required
            placeholder="1"
            key={form.key('plannedSession')}
            {...form.getInputProps('plannedSession')}
          />
          <Select
            label="Área de estudo"
            placeholder="Selecione uma opção"
            data={displayStudySectors}
            searchable
            required
            key={form.key('studySector')}
            {...form.getInputProps('studySector')}
            nothingFoundMessage="Nenhuma área de estudo encontrada..."
          />
        </Group>
      </Stack>

      <Flex direction="row-reverse" gap="xs" ml="auto" mt="md">
        <Button type="submit" loading={mutation.isPending}>
          Adicionar
        </Button>
        <Button variant="default" fw="normal" onClick={close}>
          Cancelar
        </Button>
      </Flex>
    </form>
  );
}
