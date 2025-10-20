import { Card, Flex, Group, Skeleton, Stack, Text } from '@mantine/core';
import { useState } from 'react';

import NextConsultationMenu from './next-consultation-menu';

interface procedureSummaryProps {
  lastConsultation?: string | null;
  patientId: string;
  isLoading?: boolean;
}

export default function HistorySummary({
  lastConsultation,
  patientId,
  isLoading,
}: procedureSummaryProps) {
  const nextConsultationQueryOptions = {
    queryKey: ['nextConsultationDate', patientId],
  };

  const [nextConsultationDate, setNextConsultationDate] = useState<Date>();

  const handleSaveNextConsultation = (date: Date) => {
    setNextConsultationDate(date);
  };

  return (
    <Flex gap="xs">
      <Card withBorder shadow="sm" radius="md" p="sm" flex={1}>
        <Stack gap="4" h="100%" justify="center">
          <Text size="sm">Última consulta</Text>
          {(isLoading ?? false) ? (
            <Skeleton height={24} radius="none" />
          ) : lastConsultation == null ? (
            <Text fw={600}>Não informado</Text>
          ) : (
            <Text fw={600}>{lastConsultation}</Text>
          )}
        </Stack>
      </Card>
      <Card withBorder shadow="sm" radius="md" p="sm" flex={1}>
        <Stack gap="4" h="100%" justify="center">
          <Group justify="space-between">
            <Text size="sm">Próxima consulta</Text>
            <NextConsultationMenu
              patientId={patientId}
              queryOptions={nextConsultationQueryOptions}
              onSave={handleSaveNextConsultation}
            />
          </Group>
          <Text fw={600}>
            {nextConsultationDate
              ? new Date(nextConsultationDate).toLocaleDateString('pt-BR')
              : 'Não agendada'}
          </Text>
        </Stack>
      </Card>
    </Flex>
  );
}
