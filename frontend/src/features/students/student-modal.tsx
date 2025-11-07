import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface StudentModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function StudentModal({ opened, onClose }: StudentModalProps) {
  return (
    <Modal.Root opened={opened} onClose={onClose} size="xl">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Stack gap="0" style={{ flex: 1 }}>
            <Group>
              <Modal.Title fw="600">Criação de Aluno</Modal.Title>
              <Modal.CloseButton />
            </Group>
            <Text size="sm" c="dimmed">
              Para criar um novo aluno, insira os dados abaixo.
            </Text>
          </Stack>
        </Modal.Header>
        <Modal.Body>
          <StudentForm onClose={onClose} />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

function StudentForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const session = useSession();
  const initialValues = {
    name: '',
    email: '',
    clinicNumber: '',
    enrollmentCode: '',
    enrollmentYear: '',
    enrollmentSemester: '',
  };
  type Student = { name: string };
  const mutation = useMutation({
    mutationFn: async (data: typeof initialValues): Promise<Student> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/students`,
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
        throw new Error('Erro ao criar aluno');
      }
      return (await res.json()) as Student;
    },
    onSuccess: (student: Student) => {
      notifications.show({
        title: 'Aluno criado',
        message: `Aluno ${student.name} criado com sucesso.`,
        color: 'green',
        autoClose: 5000,
      });
      onClose();
      router.refresh();
    },
    onError: () => {
      notifications.show({
        message: 'Erro ao criar Aluno',
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
            label="Número da Clínica"
            {...form.getInputProps('clinicNumber')}
            required
          />
          <TextInput
            label="Código de Matrícula"
            {...form.getInputProps('enrollmentCode')}
            required
          />
        </Group>
        <Group grow align="flex-start">
          <TextInput
            label="Ano de Ingresso"
            {...form.getInputProps('enrollmentYear')}
            required
          />
          <TextInput
            label="Semestre de Ingresso"
            {...form.getInputProps('enrollmentSemester')}
            required
          />
        </Group>
        <Group justify="flex-end" mt="md" gap="xs">
          <Button type="submit" loading={mutation.isPending}>
            Criar Aluno
          </Button>
          <Button variant="default" fw="normal" onClick={onClose}>
            Cancelar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
