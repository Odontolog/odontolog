import { ethnicity, maritalStatus, sex } from '@/shared/data';
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
  Title,
} from '@mantine/core';
import { DateInput, DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { IMaskInput } from 'react-imask';

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
          <RecordForm opened={opened} onClose={onClose} />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

function RecordForm({ opened, onClose }: recordModalProps) {
  return (
    <form>
      <Stack>
        <TextInput
          label="Nome Completo"
          required
          placeholder="Nome do paciente"
          // key={form.key('plannedSession')}
          // {...form.getInputProps('plannedSession')}
        />

        <Group grow>
          <DateInput
            leftSection={<IconCalendar size={18} stroke={1.5} />}
            leftSectionPointerEvents="none"
            required
            valueFormat="DD/MM/YYYY"
            firstDayOfWeek={0}
            dateParser={parseDateDDMMYYYY}
            label="Data de nascimento"
            placeholder="14/10/2000"
          />
          <Input.Wrapper label="Telefone" withAsterisk>
            <Input
              component={IMaskInput}
              mask="(00) 00000-0000"
              placeholder="(00) 98765-7712"
              required
            />
          </Input.Wrapper>
        </Group>

        <Group grow>
          <Input.Wrapper label="CPF" withAsterisk>
            <Input
              component={IMaskInput}
              mask="000.000.000-00"
              placeholder="000.000.000-00"
              required
            />
          </Input.Wrapper>
          <Input.Wrapper label="RG" withAsterisk>
            <Input
              component={IMaskInput}
              mask="0000000-0"
              placeholder="0000000-0"
              required
            />
          </Input.Wrapper>
          <TextInput label="SSP" required placeholder="SSP/AL" />
        </Group>

        <Group grow>
          <Select
            label="Estado cívil"
            placeholder="Selecione uma opção"
            data={maritalStatus}
            searchable
            required
          />
          <Select
            label="Sexo"
            placeholder="Selecione uma opção"
            data={sex}
            searchable
            required
          />
          <Select
            label="Cor autodeclarada"
            placeholder="Selecione uma opção"
            data={ethnicity}
            searchable
            required
          />
        </Group>

        <TextInput label="Endereço" placeholder="Rua da paz, 123" required />

        <Group grow>
          <TextInput label="Cidade" placeholder="Maceió" required />
          <TextInput label="Estado" placeholder="Alagoas" required />
        </Group>

        <TextInput label="Profissão" placeholder="Profissão" required />
      </Stack>

      <Flex direction="row-reverse" gap="xs" ml="auto" mt="md">
        <Button type="submit" loading={false}>
          Adicionar
        </Button>
        <Button variant="default" fw="normal" onClick={onClose}>
          Cancelar
        </Button>
      </Flex>
    </form>
  );
}
