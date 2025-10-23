import { Card, Flex, Group, Skeleton, Stack, Text } from '@mantine/core';
import { useState } from 'react';

import NextAppointmentMenu from './next-appointment-menu';
import { getNextAppointmentOptions } from '../requests';
import { useQuery } from '@tanstack/react-query';

interface procedureSummaryProps {
  lastAppointment?: string | null;
  patientId: string;
  isLoading?: boolean;
}

export default function HistorySummary({
  lastAppointment,
  patientId,
  isLoading,
}: procedureSummaryProps) {
  const nextAppointmentQueryOptions = getNextAppointmentOptions(patientId);

  const { data: nextAppointment, isLoading: isAppointmentLoading } = useQuery({
    ...nextAppointmentQueryOptions,
  });

  return (
    <Flex gap="xs">
      <Card withBorder shadow="sm" radius="md" p="sm" flex={1}>
        <Stack gap="4" h="100%" justify="center">
          <Text size="sm">Última consulta</Text>
          {(isLoading ?? false) ? (
            <Skeleton height={24} radius="none" />
          ) : lastAppointment == null ? (
            <Text fw={600}>Não informado</Text>
          ) : (
            <Text fw={600}>{lastAppointment}</Text>
          )}
        </Stack>
      </Card>
      <Card withBorder shadow="sm" radius="md" p="sm" flex={1}>
        <Stack gap="4" h="100%" justify="center">
          <Group justify="space-between">
            <Text size="sm">Próxima consulta</Text>
            <NextAppointmentMenu patientId={patientId} />
          </Group>
          {isAppointmentLoading ? (
            <Skeleton height={24} radius="none" />
          ) : (
            <Text fw={600}>
              {nextAppointment
                ?nextAppointment.toLocaleDateString('pt-BR')
                : 'Não agendada'}
            </Text>
          )}
        </Stack>
      </Card>
    </Flex>
  );
}
