import { Card, Center, Divider, Group, Loader, Text } from '@mantine/core';
import { getTratmentPlanOptions } from '../treatment-plan/requests';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

interface TreatmentPlanDetailSectionProps {
  patientId: string;
}
export default function TreatmentPlanDetailSection({
  patientId,
}: TreatmentPlanDetailSectionProps) {
  const searchParams = useSearchParams();
  const active = searchParams.get('active');

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      {active !== null ? (
        <TreatmentPlanDetailContent treatmentPlanId={active} />
      ) : (
        <div>Selecione um procedimento</div>
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
      <Center py="md">
        <Loader size="sm" />
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
