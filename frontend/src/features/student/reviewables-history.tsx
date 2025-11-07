'use client';

import {
  Card,
  Center,
  Divider,
  Grid,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import ProcedureCard from '@/shared/components/procedure-card';
import TreatmentPlanCard from '@/shared/components/treatment-plan-card';
import { getStudentReviewable } from '@/shared/reviewable/requests';
import { isProcedure, isTreatmentPlan } from '@/shared/utils';

export default function StudentReviewableHistorySection({
  studentId,
}: {
  studentId: string;
}) {
  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Group>
            <Text fw={600} size="lg">
              Histórico de artefatos
            </Text>
          </Group>
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm" mih="220">
        <ReviewableContent studentId={studentId} />
      </Card.Section>
    </Card>
  );
}

interface ReviewableContentProps {
  studentId: string;
}
function ReviewableContent({ studentId }: ReviewableContentProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['studentReviewable', studentId],
    queryFn: () => getStudentReviewable(studentId),
  });

  if (isLoading) {
    return (
      <Stack gap="xs">
        <Skeleton height={90} radius="none" />
        <Skeleton height={90} radius="none" />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Center py="md">
        <Text fw={600} size="lg" c="dimmed" ta="center">
          Algo deu errado. <br />
          Não foi possível carregar os artefatos.
        </Text>
      </Center>
    );
  }

  if (data === undefined) {
    return null;
  }

  if (data.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center">
        Nenhum artefato para este aluno.
      </Text>
    );
  }

  return (
    <Grid gutter="xs">
      {data
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
        .map((rev) => {
          if (isProcedure(rev)) {
            return (
              <Grid.Col span={{ sm: 12, md: 6 }} key={rev.id}>
                <ProcedureCard
                  procedure={rev}
                  hideNotes
                  disableSession
                  fields={['updated', 'teeth', 'study_sector']}
                />
              </Grid.Col>
            );
          }
          if (isTreatmentPlan(rev)) {
            return (
              <Grid.Col span={{ sm: 12, md: 6 }} key={rev.id}>
                <TreatmentPlanCard
                  hideNotes
                  treatmentPlan={rev}
                  fields={['updated']}
                />
              </Grid.Col>
            );
          }
          return null;
        })}
    </Grid>
  );
}
