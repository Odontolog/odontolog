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
import { useQuery } from '@tanstack/react-query';

import ProcedureCard from '@/shared/components/procedure-card';
import { ProcedureShort } from '@/shared/models';
import { getPatientProcedureList } from '../requests';

interface ProcedureHistorySectionProps {
  patientId: string;
}

export default function ProcedureHistorySection({
  patientId,
}: ProcedureHistorySectionProps) {
  const procedures = getPatientProcedureList(patientId);

  const { data, isLoading } = useQuery({
    ...procedures,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%" miw="400px">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Histórico de procedimentos
          </Text>
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
            h="510px"
          >
            <ProceduresContent data={data} />
          </ScrollArea>
        )}
      </Card.Section>
    </Card>
  );
}

function ProceduresContent({ data }: { data: ProcedureShort[] }) {
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
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, plans]) => (
          <Timeline.Item key={year} title={year}>
            <Stack gap="sm" my="xs">
              {plans.map((pcd) => (
                <ProcedureCard
                  key={pcd.id}
                  disableSession
                  procedure={pcd}
                  fields={['patient', 'assignee', 'teeth', 'updated']}
                />
              ))}
            </Stack>
          </Timeline.Item>
        ))}
    </Timeline>
  );
}
