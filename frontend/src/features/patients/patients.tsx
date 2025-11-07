'use client';

import { Badge, Card, Divider, Grid, Group, Text } from '@mantine/core';

import { PatientCard } from '@/shared/components/patient-card';
import { PatientAndTreatmentPlan } from '@/shared/models';

interface PatientsSectionProps {
  patients: PatientAndTreatmentPlan[];
}

export default function PatientsSection({ patients }: PatientsSectionProps) {
  const inProgressCount = patients.filter(
    (patient) => patient.lastTreatmentPlanStatus === 'IN_PROGRESS',
  ).length;

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Group>
            <Text fw={600} size="lg">
              Pacientes
            </Text>
            <Badge variant="light" color="teal">
              {inProgressCount} em andamento
            </Badge>
          </Group>
        </Group>
      </Card.Section>

      <Divider my="none" />
      <Card.Section inheritPadding px="md" py="sm">
        <Grid gutter="xs">
          {patients.map((patient) => (
            <Grid.Col span={{ sm: 12, md: 6 }} key={patient.id}>
              <PatientCard patient={patient} />
            </Grid.Col>
          ))}
        </Grid>
      </Card.Section>
    </Card>
  );
}
