'use client';

import ProcedureCard from '@/shared/components/procedure-card';
import TreatmentPlanCard from '@/shared/components/treatment-plan-card';
import { getStudentReviewable } from '@/shared/reviewable/requests';
import { isProcedure, isTreatmentPlan } from '@/shared/utils';
import {
  Card,
  Group,
  Divider,
  Grid,
  Text,
  Skeleton,
  Stack,
  Center,
  ScrollArea,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

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

      <Card.Section inheritPadding px="md" py="sm">
        <ScrollArea scrollbars="y" mah={300}>
          <ReviewableContent studentId={studentId} />
        </ScrollArea>
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
      <Grid gutter="xs">
        <Stack h="100%" gap="xs">
          <Skeleton height={131} radius="none" />
          <Skeleton height={131} radius="none" />
          <Skeleton height={131} radius="none" />
        </Stack>
      </Grid>
    );
  }

  if (isError) {
    return (
      <Center py="md" h="100%">
        <Text fw={600} size="lg" c="dimmed" ta="center">
          Algo deu errado. <br />
          Não foi possível carregar os artefatos.
        </Text>
      </Center>
    );
  }

  if (data === undefined || data.length === 0) {
    return null;
  }

  return (
    <Grid gutter="xs">
      {data.map((rev) => {
        if (isProcedure(rev)) {
          return (
            <Grid.Col span={{ sm: 12, md: 6 }} key={rev.id}>
              <ProcedureCard
                procedure={rev}
                disableSession
                fields={['patient', 'updated', 'teeth', 'study_sector']}
              />
            </Grid.Col>
          );
        }
        if (isTreatmentPlan(rev)) {
          return (
            <Grid.Col span={{ sm: 12, md: 6 }} key={rev.id}>
              <TreatmentPlanCard
                treatmentPlan={rev}
                fields={['patient', 'updated']}
              />
            </Grid.Col>
          );
        }
        return null;
      })}
    </Grid>
  );
}
