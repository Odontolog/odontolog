import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface SupervisorModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function SupervisorModal({
  opened,
  onClose,
}: SupervisorModalProps) {
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
              Para criar um novo supervisor, insira os dados abaixo.
            </Text>
          </Stack>
        </Modal.Header>
        <Modal.Body>
          <SupervisorForm onClose={onClose} />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

function SupervisorForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const session = useSession();
  const initialValues = {
    name: '',
    email: '',
    specialization: '',
    siape: '',
  };
  type Supervisor = { name: string };
  const mutation = useMutation({
    mutationFn: async (data: typeof initialValues): Promise<Supervisor> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/supervisors`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.data?.user.accessToken}`,
          },
          body: JSON.stringify(data),
        },
      );
      if (!res.ok) {
        throw new Error('Erro ao criar supervisor');
      }
      return (await res.json()) as Supervisor;
    },
    onSuccess: (supervisor: Supervisor) => {
      notifications.show({
        title: 'Supervisor criado',
        message: `Supervisor ${supervisor.name} criado com sucesso.`,
        color: 'green',
        autoClose: 5000,
      });
      onClose();
      router.refresh();
    },
    onError: () => {
      notifications.show({
        message: 'Erro ao criar supervisor',
        color: 'red',
        autoClose: 5000,
      });
      onClose();
    },
  });
  const form = useForm({ initialValues });
  return (
    <form
      onSubmit={form.onSubmit((values) => mutation.mutate(values))}
      style={{ width: '100%' }}
    >
      <Stack>
        <TextInput label="Nome" {...form.getInputProps('name')} required />
        <TextInput label="Email" {...form.getInputProps('email')} required />
        <Group grow align="flex-start">
          <TextInput
            label="Especialização"
            {...form.getInputProps('specialization')}
            required
          />
          <TextInput label="SIAPE" {...form.getInputProps('siape')} required />
        </Group>
        <Group justify="flex-end" mt="md" gap="xs">
          <Button type="submit" loading={mutation.isPending}>
            Criar Supervisor
          </Button>
          <Button variant="default" fw="normal" onClick={onClose}>
            Cancelar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
