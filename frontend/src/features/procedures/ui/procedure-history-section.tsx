'use client';

import {
  Card,
  Center,
  Divider,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Timeline,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import ProcedureCard from '@/shared/components/procedure-card';
import { ProcedureShort } from '@/shared/models';
import { getPatientProcedureOptions } from '../requests';
import HistorySummary from './history-summary';

interface ProcedureHistorySectionProps {
  patientId: string;
}

export default function ProcedureHistorySection({
  patientId,
}: ProcedureHistorySectionProps) {
  const options = getPatientProcedureOptions(patientId);

  const { data, isLoading, isError } = useQuery({
    ...options,
  });

  const lastAppointmentDate =
    data && data.length > 0
      ? new Date(
          Math.max(...data.map((pcd) => new Date(pcd.updatedAt).getTime())),
        )
      : null;

  return (
    <Stack flex="1" h="100%">
      <HistorySummary
        lastAppointment={lastAppointmentDate?.toLocaleDateString('pt-BR')}
        patientId={patientId}
        isLoading={isLoading}
      />
      <Card withBorder shadow="sm" radius="md" px="sm" h="100%" flex="1">
        <Card.Section inheritPadding py="sm">
          <Group justify="space-between">
            <Text fw={600} size="lg">
              Histórico de procedimentos
            </Text>
          </Group>
        </Card.Section>

        <Divider my="none" />

        <Card.Section p="md" h="100%" style={{ overflowY: 'hidden' }}>
          <ProceduresContent
            data={data}
            isError={isError}
            isLoading={isLoading}
          />
        </Card.Section>
      </Card>
    </Stack>
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

interface ProcedureContentProps {
  data?: ProcedureShort[];
  isLoading: boolean;
  isError: boolean;
}

function ProceduresContent({
  data,
  isLoading,
  isError,
}: ProcedureContentProps) {
  const matches = useMediaQuery('(max-width: 62em)');
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('active');

  if (isError) {
    return (
      <Center py="md" h="100%">
        <Text fw={600} size="lg" c="dimmed" ta="center">
          Algo deu errado. <br />
          Não foi possível carregar histórico de procedimentos do paciente.
        </Text>
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Stack h="100%" gap="xs">
        <Skeleton height={131} radius="none" />
        <Skeleton height={131} radius="none" />
        <Skeleton height={131} radius="none" />
      </Stack>
    );
  }

  if (!data) {
    return null;
  }

  if (data.length === 0) {
    return (
      <Center py="md" h="100%" px="lg">
        <Stack align="center">
          <Text fw={600} size="lg" c="dimmed" ta="center">
            O paciente ainda não tem procedimentos concluídos.
            <br />
          </Text>
        </Stack>
      </Center>
    );
  }

  function onProcedureSelect(procedureId: string, patientId: string) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('active', procedureId);

    if (matches) {
      router.push(`/patients/${patientId}/procedures/${procedureId}`);
    } else {
      router.push(`?${newParams.toString()}`, { scroll: false });
    }
  }

  function getDate(pcd: ProcedureShort): Date {
    return pcd.performedAt === null ? pcd.updatedAt : pcd.performedAt;
  }

  const proceduresByDate = data.reduce((acc, pcd) => {
    const dateObj = getDate(pcd);
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
    procedures.sort((a, b) => getDate(b).getTime() - getDate(a).getTime());
  }

  return (
    <ScrollArea
      scrollbarSize={6}
      offsetScrollbars
      scrollbars="y"
      w="100%"
      h="100%"
    >
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
                  .sort((a, b) => getDate(b).getTime() - getDate(a).getTime())
                  .map((pcd) => (
                    <ProcedureCard
                      key={pcd.id}
                      disableSession
                      procedure={pcd}
                      fields={['patient', 'assignee', 'teeth', 'updated']}
                      selected={pcd.id === active?.toString()}
                      onSelect={(procedureId: string) =>
                        onProcedureSelect(procedureId, pcd.patient.id)
                      }
                    />
                  ))}
              </Stack>
            </Timeline.Item>
          ))}
        {getLastEmptyDay(proceduresByDate)}
      </Timeline>
    </ScrollArea>
  );
}
