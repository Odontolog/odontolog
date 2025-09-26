'use client';
import { loggedSupervisor } from '@/mocks/students';
import ProcedureCard from '@/shared/components/procedure-card';
import TreatmentPlanCard from '@/shared/components/treatment-plan-card';
import { ProcedureShort, TreatmentPlanShort } from '@/shared/models';
import {
  Badge,
  Card,
  Center,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getValidationsOptions } from './requests.';

export default function ValidationsSection() {
  const supervisorId = loggedSupervisor.id;
  const options = getValidationsOptions(supervisorId);

  const { data, isLoading } = useQuery({ ...options });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%" miw="400px">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Group>
            <Text fw={600} size="lg">
              Validação
            </Text>
            <Badge variant="light" color="yellow" size="sm">
              {5} esperando
            </Badge>
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
          <ValidationsContent data={data} />
        )}
      </Card.Section>
    </Card>
  );
}

function isProcedure(
  r: TreatmentPlanShort | ProcedureShort,
): r is ProcedureShort {
  return r.type === 'procedure';
}

function isTreatmentPlan(
  r: TreatmentPlanShort | ProcedureShort,
): r is TreatmentPlanShort {
  return r.type === 'treatment_plan';
}

function ValidationsContent({
  data,
}: {
  data: (TreatmentPlanShort | ProcedureShort)[];
}) {
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
          return <ProcedureCard key={index} procedure={rev} />;
        }
        if (isTreatmentPlan(rev)) {
          return <TreatmentPlanCard key={index} treatmentPlan={rev} />;
        }
        return null;
      })}
    </Stack>
  );
}
