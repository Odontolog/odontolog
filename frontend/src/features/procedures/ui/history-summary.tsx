import { Text, Card, Flex, ThemeIcon, Group } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import NextConsultationMenu from './next-consultation-menu';
import { useState } from 'react';

interface procedureSummaryProps {
  lastConsultation?: string | null;
  patientId: string;
}

export default function HistorySummary({
  lastConsultation,
  patientId,
}: procedureSummaryProps) {
  const nextConsultationQueryOptions = {
    queryKey: ['nextConsultationDate', patientId],
  };

  const [nextConsultationDate, setNextConsultationDate] = useState<Date>();

  const handleSaveNextConsultation = (date: Date) => {
    setNextConsultationDate(date);
  };

  return (
    <Flex gap="xs" justify="space-between">
      <Card withBorder shadow="sm" radius="md" px="sm">
        <Card.Section inheritPadding py="sm">
          <Group>
            <Text fw={400} size="md">
              Última consulta
            </Text>
            <ThemeIcon variant="light" size="md" color="gray" radius="xl">
              <IconInfoCircle style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
          </Group>
        </Card.Section>
        <Text fw={600}>{lastConsultation}</Text>
      </Card>
      <Card withBorder shadow="sm" radius="md" px="sm">
        <Card.Section inheritPadding py="sm">
          <Group>
            <Text>Próxima consulta</Text>
            <NextConsultationMenu
              patientId={patientId}
              queryOptions={nextConsultationQueryOptions}
              onSave={handleSaveNextConsultation}
            />
          </Group>
        </Card.Section>
        <Text fw={550}>
          {nextConsultationDate
            ? new Date(nextConsultationDate).toLocaleDateString('pt-BR')
            : 'Não agendada'}
        </Text>
      </Card>
    </Flex>
  );
}
