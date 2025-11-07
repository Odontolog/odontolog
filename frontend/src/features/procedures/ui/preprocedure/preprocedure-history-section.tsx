'use client';

import {
  ActionIcon,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Modal,
  ScrollArea,
  Select,
  Skeleton,
  Stack,
  Text,
  Timeline,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import ProcedureCard from '@/shared/components/procedure-card';
import { ProcedureShort } from '@/shared/models';
import { preproceduresValues } from '../../data';
import {
  createPreprocedure,
  getPatientPreprocedureOptions,
} from '../../requests';

interface ProcedureHistorySectionProps {
  patientId: string;
  scrollAreaHeight?: string;
}

export default function PreprocedureHistorySection({
  patientId,
  scrollAreaHeight = '510px',
}: ProcedureHistorySectionProps) {
  const router = useRouter();
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedPreprocedure, setSelectedPreprocedure] = useState<
    string | null
  >(null);

  const preprocedures = getPatientPreprocedureOptions(patientId);
  const { data, isLoading } = useQuery({
    ...preprocedures,
  });

  async function handleConfirm(
    patientId: string,
    selectedPreprocedure: string,
  ) {
    const newPPcd: string = await createPreprocedure(
      patientId,
      selectedPreprocedure,
    );
    router.push(`/patients/${patientId}/procedures/${newPPcd}`);
  }

  function openTPCreationModal() {
    setModalOpened(true);
    setSelectedPreprocedure(null);
  }

  function handleModalConfirm() {
    if (selectedPreprocedure !== null) {
      void handleConfirm(patientId, selectedPreprocedure);
      setModalOpened(false);
    }
  }

  return (
    <>
      <Card withBorder shadow="sm" radius="md" px="sm" h="100%">
        <Card.Section inheritPadding py="sm">
          <Group justify="space-between" wrap="nowrap">
            <Text fw={600} size="lg">
              Histórico de Pré-procedimentos
            </Text>
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled={isLoading}
              onClick={() => openTPCreationModal()}
            >
              <IconPlus size={16} />
            </ActionIcon>
          </Group>
        </Card.Section>

        <Divider my="none" />

        <Card.Section inheritPadding px="md" py="sm" h="100%">
          {isLoading || data === undefined ? (
            <Stack h="100%" gap="xs">
              <Skeleton height={120} radius="none" />
              <Skeleton height={120} radius="none" />
              <Skeleton height={120} radius="none" />
              <Skeleton height={120} radius="none" />
            </Stack>
          ) : (
            <ScrollArea
              scrollbarSize={6}
              offsetScrollbars
              scrollbars="y"
              w="100%"
              h={scrollAreaHeight}
            >
              <PreproceduresContent data={data} />
            </ScrollArea>
          )}
        </Card.Section>
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Deseja criar um novo Pré-procedimento?"
      >
        <Stack gap={8}>
          <Text size="sm">
            Clicando em confirmar você cria um novo Pré-procedimento em branco
            para o paciente.
          </Text>
          <Select
            placeholder="Escolha o pré-procedimento que vai realizar"
            data={preproceduresValues}
            value={selectedPreprocedure}
            onChange={(v) => setSelectedPreprocedure(v)}
            data-autofocus
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Cancelar
            </Button>
            <Button
              disabled={selectedPreprocedure === null}
              onClick={handleModalConfirm}
            >
              Confirmar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

function getLastEmptyDay(proceduresByDate: Map<string, ProcedureShort[]>) {
  if (proceduresByDate.size > 0) {
    const oldestDateStr = Array.from(proceduresByDate.keys()).reduce(
      (oldest, current) => {
        const [dayOld, monthOld, yearOld] = oldest.split('/').map(Number);
        const [dayCur, monthCur, yearCur] = current.split('/').map(Number);
        const dateOld = new Date(yearOld, monthOld - 1, dayOld).getTime();
        const dateCur = new Date(yearCur, monthCur - 1, dayCur).getTime();
        return dateOld < dateCur ? oldest : current;
      },
    );

    const [day, month, year] = oldestDateStr.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    dateObj.setDate(dateObj.getDate() - 1);

    const newDay = String(dateObj.getDate()).padStart(2, '0');
    const newMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
    const newYear = dateObj.getFullYear();
    const newDateKey = `${newDay}/${newMonth}/${newYear}`;

    return <Timeline.Item title={newDateKey} />;
  }
  return null;
}

function PreproceduresContent({ data }: { data: ProcedureShort[] }) {
  const matches = useMediaQuery('(max-width: 62em)');
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('active');

  if (data.length === 0) {
    return (
      <Center py="md" h="100%" px="lg">
        <Text fw={600} size="lg" c="dimmed" ta="center">
          O paciente ainda não tem nenhum pré-procedimento.
        </Text>
      </Center>
    );
  }

  function onPreprocedureSelect(procedureId: string, patientId: string) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('active', procedureId);

    if (matches) {
      router.push(`/patients/${patientId}/procedures/${procedureId}`);
    } else {
      router.push(`?${newParams.toString()}`, { scroll: false });
    }
  }

  const proceduresByDate = data.reduce((acc, pcd) => {
    const dateObj =
      pcd.updatedAt instanceof Date ? pcd.updatedAt : new Date(pcd.updatedAt);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const dateKey = `${day}/${month}/${year}`;

    if (!acc.has(dateKey)) {
      acc.set(dateKey, []);
    }
    acc.get(dateKey)!.push(pcd);

    return acc;
  }, new Map<string, ProcedureShort[]>());

  for (const [_date, procedures] of proceduresByDate) {
    procedures.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  return (
    <Timeline bulletSize={16}>
      {Array.from(proceduresByDate.entries())
        .sort(([dateA], [dateB]) => {
          const [dayA, monthA, yearA] = dateA.split('/').map(Number);
          const [dayB, monthB, yearB] = dateB.split('/').map(Number);
          return (
            new Date(yearB, monthB - 1, dayB).getTime() -
            new Date(yearA, monthA - 1, dayA).getTime()
          );
        })
        .map(([date, plans]) => (
          <Timeline.Item key={date} title={date}>
            <Stack gap="sm" my="xs">
              {plans
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                .map((pcd) => (
                  <ProcedureCard
                    key={pcd.id}
                    disableSession
                    procedure={pcd}
                    fields={['patient', 'assignee', 'updated']}
                    selected={pcd.id === active?.toString()}
                    onSelect={(procedureId: string) =>
                      onPreprocedureSelect(procedureId, pcd.patient.id)
                    }
                  />
                ))}
            </Stack>
          </Timeline.Item>
        ))}
      {getLastEmptyDay(proceduresByDate)}
    </Timeline>
  );
}
