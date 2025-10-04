'use client';

import {
  Badge,
  Card,
  Center,
  Divider,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';

import ProcedureCard from '@/shared/components/procedure-card';
import TreatmentPlanCard from '@/shared/components/treatment-plan-card';
import {
  ProcedureShort,
  ReviewableShort,
  TreatmentPlanShort,
} from '@/shared/models';
import { getValidationsOptions } from './requests';

export default function ValidationsSection() {
  const options = getValidationsOptions();

  const { data, isLoading } = useQuery({ ...options });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%" miw="400px">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Group>
            <Text fw={600} size="lg">
              Validação
            </Text>
            {data && (
              <Badge variant="light" color="yellow" size="md">
                {data?.length} esperando
              </Badge>
            )}
          </Group>
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm" h="100%">
        {isLoading || data === undefined ? (
          <Stack h="100%" gap="xs">
            <Skeleton height={120} radius="none" />
            <Skeleton height={120} radius="none" />
            <Skeleton height={120} radius="none" />
            <Skeleton height={120} radius="none" />
            <Skeleton height={120} radius="none" />
          </Stack>
        ) : (
          <ScrollArea scrollbarSize={6} offsetScrollbars w="100%" h="600px">
            <ValidationsContent data={data} />
          </ScrollArea>
        )}
      </Card.Section>
    </Card>
  );
}

function isProcedure(r: ReviewableShort): r is ProcedureShort {
  return r.type === 'PROCEDURE';
}

function isTreatmentPlan(r: ReviewableShort): r is TreatmentPlanShort {
  return r.type === 'TREATMENT_PLAN';
}

function ValidationsContent({ data }: { data: ReviewableShort[] }) {
  const matches = useMediaQuery('(min-width: 56.25em)');
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('active');

  function onReviewableSelect(
    reviewableId: string,
    patientId: string,
    type: string,
  ) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('active', reviewableId);
    newParams.set('type', type);

    if (matches) {
      router.push(`?${newParams.toString()}`, { scroll: false });
    } else {
      const basePath = type === 'TREATMENT_PLAN' ? 'treatments' : 'procedures';
      router.push(`/patients/${patientId}/${basePath}/${reviewableId}`);
    }
  }

  if (data.length === 0) {
    return (
      <Center py="md" h="100%" px="lg">
        <Stack align="center">
          <Text fw={500} size="lg" c="dimmed" ta="center">
            Não há procedimentos ou planos de tratamento precisando de sua
            revisão
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack>
      {data.map((rev, index) => {
        if (isProcedure(rev)) {
          return (
            <ProcedureCard
              key={index}
              procedure={rev}
              selected={rev.id === active?.toString()}
              onSelect={() =>
                onReviewableSelect(rev.id, rev.patient.id, rev.type)
              }
              disableSession
            />
          );
        }
        if (isTreatmentPlan(rev)) {
          return (
            <TreatmentPlanCard
              key={index}
              treatmentPlan={rev}
              selected={rev.id === active?.toString()}
              onSelect={() =>
                onReviewableSelect(rev.id, rev.patient.id, rev.type)
              }
            />
          );
        }
        return null;
      })}
    </Stack>
  );
}
