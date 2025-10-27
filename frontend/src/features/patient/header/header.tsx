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
  IconMapPin,
  IconReportSearch,
  IconMicroscope,
  // IconReportSearch,
  // IconSettings2,
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Patient } from '@/shared/models';
import {
  formatPhoneNumber,
  getEthnicityDisplay,
  getGenderDisplay,
  getMaritalStatusDisplay,
} from '../mappers';
import RecordModal from '../record-modal';
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
  // {
  //   value: 'settings',
  //   icon: <IconSettings2 size={14} />,
  //   label: 'Configurações',
  // },
];

export default function PatientHeader({ patient }: { patient: Patient }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeSubpage =
    pathname.split('/').filter(Boolean).pop() ?? 'procedure';
  const [opened, setOpen] = useState<boolean>(false);

  return (
    <>
      {/* Versão Desktop */}
      <Stack bg="white" gap={0} visibleFrom="md">
        <Stack pt="xs" m="md">
          <Group justify="space-between">
            <LeftContent patient={patient} />
            <RightContent patient={patient} onEdit={() => setOpen(true)} />
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
        <PatientHeaderMobile patient={patient} onEdit={() => setOpen(true)} />
      </Box>

      <RecordModal
        opened={opened}
        onClose={() => setOpen(false)}
        patient={patient}
      />
    </>
  );
}

function LeftContent({ patient }: { patient: Patient }) {
  const genderDisplay = getGenderDisplay(patient.sex);

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
            {genderDisplay.icon}
            <Text>{genderDisplay.label}</Text>
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

function RightContent({
  patient,
  onEdit,
}: {
  patient: Patient;
  onEdit: () => void;
}) {
  return (
    <Group align="start" gap={32}>
      <SimpleGrid cols={2} spacing="xs">
        <Text>
          <b>CPF:</b> {patient.cpf}
        </Text>
        <Text>
          <b>Telefone:</b> {formatPhoneNumber(patient.phoneNumber)}
        </Text>
        <Text>
          <b>Cidade:</b> {patient.city}
        </Text>
        <Text>
          <b>Cor:</b> {getEthnicityDisplay(patient.ethnicity)}
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
          <b>Estado Cívil:</b> {getMaritalStatusDisplay(patient.maritalStatus)}
        </Text>
      </SimpleGrid>

      <ActionIcon
        aria-label="Editar paciente"
        onClick={onEdit}
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

export function PatientHeaderMobile({
  patient,
  onEdit,
}: {
  patient: Patient;
  onEdit: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const activeSubpage =
    pathname.split('/').filter(Boolean).pop() ?? 'procedure';
  const [detailsOpened, { toggle: toggleDetails }] = useDisclosure(false);

  const genderDisplay = getGenderDisplay(patient.sex);

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
                {genderDisplay.label}
              </Text>
            </Stack>
          </Group>
          <ActionIcon
            onClick={onEdit}
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
              value={formatPhoneNumber(patient.phoneNumber)}
            />
            <DetailItem label="Profissão" value={patient.occupation} />
            <DetailItem label="Cidade" value={patient.city} />
            <DetailItem label="Estado" value={patient.state} />
            <DetailItem
              label="Cor"
              value={getEthnicityDisplay(patient.ethnicity)}
            />
            <DetailItem
              label="Estado Civil"
              value={getMaritalStatusDisplay(patient.maritalStatus)}
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
