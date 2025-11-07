'use client';

import { Badge, Card, Divider, Grid, Group, Text } from '@mantine/core';

import { Student } from '@/shared/models';
import { StudentCard } from './students-card';

interface StudentsSectionProps {
  students: Student[];
}

export default function StudentsSection({ students }: StudentsSectionProps) {
  const total = students.length;

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Group>
            <Text fw={600} size="lg">
              Alunos
            </Text>
            <Badge variant="light" color="yellow">
              {total} matriculados
            </Badge>
          </Group>
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm">
        <Grid gutter="xs">
          {students.map((student) => (
            <Grid.Col span={{ sm: 12, md: 6 }} key={student.id}>
              <StudentCard student={student} />
            </Grid.Col>
          ))}
        </Grid>
      </Card.Section>
    </Card>
  );
}
