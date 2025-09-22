'use client';
import { Avatar, Group, Stack, Title, Text, ActionIcon } from '@mantine/core';
import {
  IconCalendar,
  IconEdit,
  IconGenderAgender,
  IconGenderFemale,
  IconGenderMale,
  IconMapPin,
} from '@tabler/icons-react';
import { Patient } from '@/shared/models';

export default function PatientHeader({ patient }: { patient: Patient }) {
  return (
    <Group justify="space-between" bg="white" p="sm">
      <LeftContent patient={patient} />
      <RightContent patient={patient} />
    </Group>
  );
}

function LeftContent({ patient }: { patient: Patient }) {
  return (
    <Group>
      <Avatar
        size={150}
        color="dark"
        variant="light"
        name={patient.name}
        src={patient.avatarUrl}
      />
      <Stack gap={4}>
        <Title>{patient.name}</Title>
        <Group>
          <Group gap={4}>
            <IconCalendar size={16} />
            <Text>{patient.birthDate.toLocaleDateString('pt-BR')}</Text>
          </Group>
          <Group gap={4}>
            {patient.gender === 'male' ? (
              <>
                <IconGenderMale size={16} />
                <Text>Masculino</Text>
              </>
            ) : patient.gender === 'female' ? (
              <>
                <IconGenderFemale size={16} />
                <Text>Feminino</Text>
              </>
            ) : (
              <>
                <IconGenderAgender size={16} />
                <Text>Outro</Text>
              </>
            )}
          </Group>
        </Group>
        <Group gap={4}>
          <IconMapPin size={16} />
          <Text>{patient.address}</Text>
        </Group>
      </Stack>
    </Group>
  );
}

const ethnicityMap: Record<string, string> = {
  white: 'Branca',
  black: 'Preta',
  brown: 'Parda',
  yellow: 'Amarela',
  indigenous: 'Indígena',
  other: 'Outra',
};

const maritalStatusMap: Record<string, string> = {
  single: 'Solteiro',
  married: 'Casado',
  divorced: 'Divorciado',
  widowed: 'Viúvo',
  civil_union: 'União Estável',
  other: 'Outra',
};

function RightContent({ patient }: { patient: Patient }) {
  return (
    <Group align="start" gap={128}>
      <Stack gap={4}>
        <Text>
          <b>CPF:</b> {patient.cpf}
        </Text>
        <Text>
          <b>Telefone:</b>{' '}
          {patient.phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')}
        </Text>
        <Text>
          <b>Cidade:</b> {patient.city}
        </Text>
        <Text>
          <b>Cor:</b> {ethnicityMap[patient.ethnicity]}
        </Text>
      </Stack>
      <Stack gap={4}>
        <Text>
          <b>RG:</b> {patient.rg} {patient.ssp}
        </Text>
        <Text>
          <b>Profissão:</b> {patient.occupation}
        </Text>
        <Text>
          <b>Estado:</b> {patient.state}
        </Text>
        <Text>
          <b>Estado Cívil:</b> {maritalStatusMap[patient.maritalStatus]}
        </Text>
      </Stack>
      <ActionIcon
        onClick={() => console.log('Editar infos do paciente em um prontuário')}
        variant="subtle"
      >
        <IconEdit size={24} />
      </ActionIcon>
    </Group>
  );
}
