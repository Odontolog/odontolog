'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Card, Center, Divider, Group, Loader, Text } from '@mantine/core';

import { getTratmentPlanOptions } from '@/features/treatment-plan/requests';

export default function TreatmentPlanDetailSection() {
  const searchParams = useSearchParams();
  const active = searchParams.get('active');

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%" miw="400px">
      {active !== null ? (
        <TreatmentPlanDetailContent treatmentPlanId={active} />
      ) : (
        <Center py="md" h="100%">
          <Text fw={600} size="lg" c="dimmed">
            Selecione um procedimento
          </Text>
        </Center>
      )}
    </Card>
  );
}

interface TreatmentPlanDetailContentProps {
  treatmentPlanId: string;
}

export function TreatmentPlanDetailContent({
  treatmentPlanId,
}: TreatmentPlanDetailContentProps) {
  const {
    data: treatmentPlan,
    isLoading,
    isError,
  } = useQuery({
    ...getTratmentPlanOptions(treatmentPlanId),
  });

  if (isLoading) {
    return (
      <Center py="md" h="100%">
        <Loader size="lg" />
      </Center>
    );
  }

  if (isError) {
    <Center py="md">
      <Text fw={600} size="lg" c="red">
        Planos de tratamento não encontrado.
      </Text>
    </Center>;
  }

  if (treatmentPlan !== undefined) {
    return (
      <>
        <Card.Section inheritPadding py="sm">
          <Group justify="space-between">
            <Text fw={600} size="lg">
              Plano de tratamento #{treatmentPlanId}
            </Text>
          </Group>
        </Card.Section>

        <Divider my="none" />

        <Card.Section inheritPadding px="md" py="sm">
          conteúdo do plano {treatmentPlanId}
        </Card.Section>
      </>
    );
  }
}
