'use client';

import { proceduresShort } from '@/mocks/treatment-plan';
import ProcedureCard from '@/shared/components/procedure-card';
import { Card, Group, Divider, Grid, Text } from '@mantine/core';

export default function StudentProcedureHistorySection() {
  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Group>
            <Text fw={600} size="lg">
              Histórico de Procedimentos
            </Text>
          </Group>
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm">
        <Grid gutter="xs">
          {proceduresShort.map((pcd) => (
            <Grid.Col span={{ sm: 12, md: 6 }} key={pcd.id}>
              <ProcedureCard
                disableSession
                procedure={pcd}
                fields={[
                  'patient',
                  'assignee',
                  'updated',
                  'teeth',
                  'study_sector',
                ]}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Card.Section>
    </Card>
  );
}
