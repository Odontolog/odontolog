import {
  Button,
  Flex,
  Group,
  Input,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCalendar } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { IMaskInput } from 'react-imask';

import { ethnicity, maritalStatus, sex } from '@/shared/data';
import { Patient } from '@/shared/models';
import { PatientRecordForm } from './models';
import { createPatientRecord } from './requests';

interface recordModalProps {
  opened: boolean;
  onClose: () => void;
}

function parseDateDDMMYYYY(input: string): Date {
  const [day, month, year] = input.split('/').map(Number);
  return new Date(year, month - 1, day);
}

export default function RecordModal({ opened, onClose }: recordModalProps) {
  return (
    <Modal.Root opened={opened} onClose={onClose} size="xl">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Stack gap="0" style={{ flex: 1 }}>
            <Group>
              <Modal.Title fw="600">Criação de prontuário</Modal.Title>
              <Modal.CloseButton />
            </Group>
            <Text size="sm" c="dimmed">
              Para criar um novo prontuário, insira os dados pessoais do
              paciente.
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

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      birthDate: new Date(),
      phoneNumber: '',
      cpf: '',
      rg: '',
      ssp: '',
      maritalStatus: '',
      sex: '',
      ethnicity: '',
      address: '',
      city: '',
      state: '',
      occupation: '',
    },

    validate: {
      phoneNumber: (v: string) =>
        /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(v) ? null : 'Telefone inválido',
      cpf: (v: string) => {
        const cpf = v.replace(/\D/g, '');
        if (cpf.length !== 11) {
          return 'CPF inválido';
        }
        if (/^(\d)\1+$/.test(cpf)) {
          return 'CPF inválido';
        }

        const calc = (t: number) => {
          let sum = 0;
          for (let i = 0; i < t - 1; i++) {
            sum += Number(cpf[i]) * (t - i);
          }
          const d = 11 - (sum % 11);
          return d > 9 ? 0 : d;
        };

        if (calc(10) !== Number(cpf[9]) || calc(11) !== Number(cpf[10])) {
          return 'CPF inválido';
        }
        return null;
      },
    },
  });

  const mutation = useMutation({
    mutationFn: (patient: PatientRecordForm) => createPatientRecord(patient),
    onSuccess: (patient: Patient) => {
      form.reset();
      onClose();
      router.push(`/patients/${patient.id}`);
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        mutation.mutate(values as PatientRecordForm),
      )}
    >
      <Stack gap={0}>
        <Stack gap={0} style={{ minHeight: 78 }}>
          <TextInput
            label="Nome Completo"
            placeholder="Nome do paciente"
            required
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
        </Stack>

        <Group grow align="flex-start">
          <Stack gap={0} style={{ minHeight: 78 }}>
            <DateInput
              label="Data de nascimento"
              placeholder={new Date().toLocaleDateString('pt-BR')}
              leftSection={<IconCalendar size={18} stroke={1.5} />}
              leftSectionPointerEvents="none"
              required
              valueFormat="DD/MM/YYYY"
              firstDayOfWeek={0}
              dateParser={parseDateDDMMYYYY}
              key={form.key('birthDate')}
              {...form.getInputProps('birthDate')}
            />
          </Stack>
          <Stack gap={0} style={{ minHeight: 78 }}>
            <Input.Wrapper
              label="Telefone"
              withAsterisk
              error={form.errors.phoneNumber}
            >
              <Input
                component={IMaskInput}
                mask="(00) 00000-0000"
                placeholder="(00) 98765-7712"
                required
                key={form.key('phoneNumber')}
                {...form.getInputProps('phoneNumber')}
              />
            </Input.Wrapper>
          </Stack>
        </Group>

        <Group grow align="flex-start">
          <Stack gap={0} style={{ minHeight: 78 }}>
            <Input.Wrapper label="CPF" withAsterisk error={form.errors.cpf}>
              <Input
                component={IMaskInput}
                mask="000.000.000-00"
                placeholder="000.000.000-00"
                required
                key={form.key('cpf')}
                {...form.getInputProps('cpf')}
              />
            </Input.Wrapper>
          </Stack>
          <Stack gap={0} style={{ minHeight: 78 }}>
            <TextInput
              label="RG"
              placeholder="0000000-0"
              required
              key={form.key('rg')}
              {...form.getInputProps('rg')}
            />
          </Stack>
          <Stack gap={0} style={{ minHeight: 78 }}>
            <TextInput
              label="SSP"
              required
              placeholder="SSP/AL"
              key={form.key('ssp')}
              {...form.getInputProps('ssp')}
            />
          </Stack>
        </Group>

        <Group grow align="flex-start">
          <Stack gap={0} style={{ minHeight: 78 }}>
            <Select
              label="Estado cívil"
              placeholder="Selecione uma opção"
              data={maritalStatus}
              searchable
              required
              key={form.key('maritalStatus')}
              {...form.getInputProps('maritalStatus')}
            />
          </Stack>
          <Stack gap={0} style={{ minHeight: 78 }}>
            <Select
              label="Sexo"
              placeholder="Selecione uma opção"
              data={sex}
              searchable
              required
              key={form.key('sex')}
              {...form.getInputProps('sex')}
            />
          </Stack>
          <Stack gap={0} style={{ minHeight: 78 }}>
            <Select
              label="Cor autodeclarada"
              placeholder="Selecione uma opção"
              data={ethnicity}
              searchable
              required
              key={form.key('ethnicity')}
              {...form.getInputProps('ethnicity')}
            />
          </Stack>
        </Group>

        <Stack gap={0} style={{ minHeight: 78 }}>
          <TextInput
            label="Endereço"
            placeholder="Rua da paz, 123"
            required
            key={form.key('address')}
            {...form.getInputProps('address')}
          />
        </Stack>
        <Group grow align="flex-start">
          <Stack gap={0} style={{ minHeight: 78 }}>
            <TextInput
              label="Cidade"
              placeholder="Maceió"
              required
              key={form.key('city')}
              {...form.getInputProps('city')}
            />
          </Stack>
          <Stack gap={0} style={{ minHeight: 78 }}>
            <TextInput
              label="Estado"
              placeholder="Alagoas"
              required
              key={form.key('state')}
              {...form.getInputProps('state')}
            />
          </Stack>
        </Group>

        <Stack gap={0} style={{ minHeight: 78 }}>
          <TextInput
            label="Profissão"
            placeholder="Profissão"
            required
            key={form.key('occupation')}
            {...form.getInputProps('occupation')}
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
