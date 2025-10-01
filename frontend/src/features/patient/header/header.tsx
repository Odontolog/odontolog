'use client';

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Collapse,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendar,
  IconCheckupList,
  IconChevronDown,
  IconDental,
  IconEdit,
  IconGenderAgender,
  IconGenderFemale,
  IconGenderMale,
  IconMapPin,
  IconMicroscope,
  IconReportSearch,
  IconSettings2,
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { JSX } from 'react';

import { Patient } from '@/shared/models';
import classes from './header.module.css';

const tabs = [
  {
    value: 'procedures',
    icon: <IconDental size={14} />,
    label: 'Histórico Geral',
  },
  {
    value: 'preprocedures',
    icon: <IconMicroscope size={14} />,
    label: 'Pré-Procedimentos',
  },
  {
    value: 'treatments',
    icon: <IconCheckupList size={14} />,
    label: 'Tratamentos',
  },
  {
    value: 'documents',
    icon: <IconReportSearch size={14} />,
    label: 'Documentos',
  },
  {
    value: 'settings',
    icon: <IconSettings2 size={14} />,
    label: 'Configurações',
  },
];

export default function PatientHeader({ patient }: { patient: Patient }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeSubpage =
    pathname.split('/').filter(Boolean).pop() ?? 'procedure';

  return (
    <>
      {/* Versão Desktop */}
      <Stack bg="white" visibleFrom="md">
        <Stack pt="sm" m="md">
          <Group justify="space-between">
            <LeftContent patient={patient} />
            <RightContent patient={patient} />
          </Group>
        </Stack>
        <Tabs
          classNames={{
            tab: classes.tab,
          }}
          value={activeSubpage}
          variant="outline"
          onChange={(value) => {
            void router.push(`/patients/${patient.id}/${value}`);
          }}
        >
          <Tabs.List>
            <Box w="16px"> </Box>
            {tabs.map((tab) => (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                leftSection={tab.icon}
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </Stack>

      {/* Versão Mobile */}
      <Box hiddenFrom="md">
        <PatientHeaderMobile patient={patient} />
      </Box>
    </>
  );
}

const genderMap: Record<string, { icon: JSX.Element; label: string }> = {
  MALE: { icon: <IconGenderMale size={16} />, label: 'Masculino' },
  FEMALE: { icon: <IconGenderFemale size={16} />, label: 'Feminino' },
  OTHER: { icon: <IconGenderAgender size={16} />, label: 'Outro' },
};

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
            {genderMap[patient.gender].icon}
            <Text>{genderMap[patient.gender].label}</Text>
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

function RightContent({ patient }: { patient: Patient }) {
  return (
    <Group align="start" gap={32}>
      <SimpleGrid cols={2} spacing="xs">
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
      </SimpleGrid>

      <ActionIcon
        aria-label="Editar paciente"
        onClick={() => console.log('Editar infos do paciente em um prontuário')}
        variant="subtle"
      >
        <IconEdit size={24} />
      </ActionIcon>
    </Group>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="sm">{value}</Text>
    </Box>
  );
}

export function PatientHeaderMobile({ patient }: { patient: Patient }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeSubpage =
    pathname.split('/').filter(Boolean).pop() ?? 'procedure';
  const [detailsOpened, { toggle: toggleDetails }] = useDisclosure(false);

  return (
    <Paper>
      <Stack px="md" pt="md">
        <Group justify="space-between" align="flex-start">
          <Group>
            <Avatar
              size="xl"
              color="dark"
              variant="light"
              name={patient.name}
              src={patient.avatarUrl}
            />
            <Stack gap={0}>
              <Title order={2}>{patient.name}</Title>
              <Text size="sm" c="dimmed">
                {patient.birthDate.toLocaleDateString('pt-BR')} •{' '}
                {genderMap[patient.gender].label}
              </Text>
            </Stack>
          </Group>
          <ActionIcon
            onClick={() =>
              console.log('Editar infos do paciente em um prontuário')
            }
            variant="default"
            aria-label="Editar paciente"
          >
            <IconEdit size="1rem" />
          </ActionIcon>
        </Group>

        <Button
          fullWidth
          variant="light"
          onClick={toggleDetails}
          rightSection={
            <IconChevronDown
              size="1rem"
              style={{
                transform: detailsOpened ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          }
        >
          {detailsOpened ? 'Ocultar detalhes' : 'Ver todos os detalhes'}
        </Button>

        <Collapse in={detailsOpened}>
          <SimpleGrid cols={2} spacing="md">
            <DetailItem label="CPF" value={patient.cpf} />
            <DetailItem label="RG" value={`${patient.rg} ${patient.ssp}`} />
            <DetailItem
              label="Contato"
              value={patient.phone.replace(
                /^(\d{2})(\d{5})(\d{4})$/,
                '($1) $2-$3',
              )}
            />
            <DetailItem label="Profissão" value={patient.occupation} />
            <DetailItem label="Cidade" value={patient.city} />
            <DetailItem label="Estado" value={patient.state} />
            <DetailItem label="Cor" value={ethnicityMap[patient.ethnicity]} />
            <DetailItem
              label="Estado Civil"
              value={maritalStatusMap[patient.maritalStatus]}
            />
          </SimpleGrid>
        </Collapse>
      </Stack>
      <Tabs
        pt="1rem"
        classNames={{
          tab: classes.tab,
        }}
        value={activeSubpage}
        variant="outline"
        onChange={(value) => {
          void router.push(`/patients/${patient.id}/${value}`);
        }}
      >
        <Tabs.List>
          <Box w="16px"> </Box>
          {tabs.map((tab) => (
            <Tabs.Tab
              key={tab.value}
              value={tab.value}
              leftSection={tab.icon}
            />
          ))}
        </Tabs.List>
      </Tabs>
    </Paper>
  );
}
