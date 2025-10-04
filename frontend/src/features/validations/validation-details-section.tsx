'use client';

import { Center, Text, Card } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import ProcedureDetailSection from '../procedures/procedures-detail-section';
import TreatmentPlanDetailSection from '../treatment-plans/treatment-plan-detail-section';

export default function ValidationDetailSection() {
  const searchParams = useSearchParams();
  const active = searchParams.get('active');
  const type = searchParams.get('type');

  if (active === null) {
    return (
      <Card withBorder shadow="sm" radius="md" px="sm" h="100%" miw="400px">
        <Center py="md" h="100%">
          <Text fw={600} size="lg" c="dimmed">
            Selecione um item para revisar
          </Text>
        </Center>
      </Card>
    );
  }

  if (type === 'TREATMENT_PLAN') {
    return <TreatmentPlanDetailSection />;
  }

  if (type === 'PROCEDURE') {
    return <ProcedureDetailSection />;
  }

  return null;
}
