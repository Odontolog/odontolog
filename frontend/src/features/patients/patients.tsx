'use client';

import { Card, Divider, Grid, Group, Text } from '@mantine/core';

import { PatientCard } from '@/shared/components/patient-card';
import { PatientAndTreatmentPlan } from '@/shared/models';

interface PatientsSectionProps {
  patients: PatientAndTreatmentPlan[];
}

export default function PatientsSection({ patients }: PatientsSectionProps) {
  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Pacientes
          </Text>
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
