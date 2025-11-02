import {
  Button,
  Flex,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { StudentRecordForm } from './models';
import { notifications } from '@mantine/notifications';
import { createStudentRecord, StudentResponse } from './requests';

interface RecordModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function StudentRecordModal({
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
              <Modal.Title fw="600">Criação de Aluno</Modal.Title>
              <Modal.CloseButton />
            </Group>
            <Text size="sm" c="dimmed">
              Para criar um novo aluno, insira os dados pessoais do estudante.
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
    clinicNumber: 1,
    enrollmentCode: '',
    enrollmentYear: new Date().getFullYear(),
    enrollmentSemester: 1,
  };

  const mutation = useMutation({
    mutationFn: (student: StudentRecordForm) => createStudentRecord(student),
    onSuccess: (student: StudentResponse) => {
      form.reset();
      onClose();
      notifications.show({
        title: 'Aluno criado',
        message: `Aluno ${student.name} criado com sucesso.`,
        color: 'green',
        autoClose: 5000,
      });
      router.push(`/students/${student.id}`);
    },
    onError: () => {
      onClose();
      notifications.show({
        message: 'Erro ao criar aluno',
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
      enrollmentCode: (v: string) => {
        if (!v || v.length === 0) {
          return 'Código de matrícula é obrigatório';
        }
        return null;
      },
    },
  });

  function handleSubmit(values: StudentRecordForm) {
    mutation.mutate(values);
  }

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        handleSubmit(values as StudentRecordForm),
      )}
    >
      <Stack gap={0}>
        <Stack gap={0} style={{ minHeight: 78 }}>
          <TextInput
            label="Nome Completo"
            placeholder="Nome do aluno"
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

        <Group grow align="flex-start">
          <Stack gap={0} style={{ minHeight: 78 }}>
            <TextInput
              label="Código de Matrícula"
              placeholder="20250914"
              required
              key={form.key('enrollmentCode')}
              {...form.getInputProps('enrollmentCode')}
            />
          </Stack>
          <Stack gap={0} style={{ minHeight: 78 }}>
            <NumberInput
              label="Número da Clínica"
              placeholder="1"
              required
              min={1}
              key={form.key('clinicNumber')}
              {...form.getInputProps('clinicNumber')}
            />
          </Stack>
        </Group>

        <Group grow align="flex-start">
          <Stack gap={0} style={{ minHeight: 78 }}>
            <NumberInput
              label="Ano de Matrícula"
              placeholder="2025"
              required
              min={1900}
              max={2100}
              key={form.key('enrollmentYear')}
              {...form.getInputProps('enrollmentYear')}
            />
          </Stack>
          <Stack gap={0} style={{ minHeight: 78 }}>
            <NumberInput
              label="Semestre de Matrícula"
              placeholder="1"
              required
              min={1}
              max={2}
              key={form.key('enrollmentSemester')}
              {...form.getInputProps('enrollmentSemester')}
            />
          </Stack>
        </Group>
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
