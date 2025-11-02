import {
  Button,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { SupervisorRecordForm } from './models';
import { notifications } from '@mantine/notifications';
import { createSupervisorRecord, SupervisorResponse } from './requests';

interface RecordModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function SupervisorRecordModal({
  opened,
  onClose,
}: RecordModalProps) {
  return (
    <Modal.Root opened={opened} onClose={onClose} size="xl">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Stack gap="0" style={{ flex: 1 }}>
            <Group>
              <Modal.Title fw="600">Criação de Supervisor</Modal.Title>
              <Modal.CloseButton />
            </Group>
            <Text size="sm" c="dimmed">
              Para criar um novo supervisor, insira os dados pessoais do
              professor.
            </Text>
          </Stack>
        </Modal.Header>

        <Modal.Body>
          <RecordForm onClose={onClose} />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

function RecordForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const initialValues = {
    name: '',
    email: '',
    specialization: '',
    siape: '',
  };

  const mutation = useMutation({
    mutationFn: (supervisor: SupervisorRecordForm) =>
      createSupervisorRecord(supervisor),
    onSuccess: (supervisor: SupervisorResponse) => {
      form.reset();
      onClose();
      notifications.show({
        title: 'Supervisor criado',
        message: `Supervisor ${supervisor.name} criado com sucesso.`,
        color: 'green',
        autoClose: 5000,
      });
      router.push(`/supervisors/${supervisor.id}`);
    },
    onError: () => {
      onClose();
      notifications.show({
        message: 'Erro ao criar supervisor',
        color: 'red',
        autoClose: 5000,
      });
    },
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues,
    validate: {
      email: (v: string) => {
        if (!v.includes('@')) {
          return 'Email inválido';
        }
        return null;
      },
      siape: (v: string) => {
        if (!v || v.length === 0) {
          return 'SIAPE é obrigatório';
        }
        return null;
      },
    },
  });

  function handleSubmit(values: SupervisorRecordForm) {
    mutation.mutate(values);
  }

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        handleSubmit(values as SupervisorRecordForm),
      )}
    >
      <Stack gap={0}>
        <Stack gap={0} style={{ minHeight: 78 }}>
          <TextInput
            label="Nome Completo"
            placeholder="Nome do supervisor"
            required
            data-autofocus
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
        </Stack>

        <Stack gap={0} style={{ minHeight: 78 }}>
          <TextInput
            label="Email"
            placeholder="email@exemplo.com"
            required
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
        </Stack>

        <Stack gap={0} style={{ minHeight: 78 }}>
          <TextInput
            label="Especialização"
            placeholder="Cirurgia"
            required
            key={form.key('specialization')}
            {...form.getInputProps('specialization')}
          />
        </Stack>

        <Stack gap={0} style={{ minHeight: 78 }}>
          <TextInput
            label="SIAPE"
            placeholder="20250832"
            required
            key={form.key('siape')}
            {...form.getInputProps('siape')}
          />
        </Stack>
      </Stack>

      <Flex direction="row-reverse" gap="xs" ml="auto" mt="md">
        <Button type="submit" loading={mutation.isPending}>
          Adicionar
        </Button>
        <Button variant="default" fw="normal" onClick={onClose}>
          Cancelar
        </Button>
      </Flex>
    </form>
  );
}
