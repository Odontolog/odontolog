import { Text, Card, Flex, ThemeIcon, Group } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface procedureSummaryProps {
  lastConsultation?: string | null;
  nextConsultation?: string | null;
}

export default function HistorySummary({
  lastConsultation,
  nextConsultation,
}: procedureSummaryProps) {
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
          <Text>Próxima consulta</Text>
        </Card.Section>
        <Text fw={600}>{nextConsultation}</Text>
      </Card>
    </Flex>
  );
}
