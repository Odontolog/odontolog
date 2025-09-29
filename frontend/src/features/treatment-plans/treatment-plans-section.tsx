'use client';

import {
  ActionIcon,
  Card,
  Center,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  Timeline,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import TreatmentPlanCard from '@/shared/components/treatment-plan-card';
import { TreatmentPlanShort } from '@/shared/models';
import {
  createPatientTreatmentPlan,
  getPatientTratmentPlansOptions,
} from './requests';

interface TreatmentPlansSectionProps {
  patientId: string;
}

function openTPCreationModal(
  patientName: string,
  mutation: UseMutationResult<string, Error, void, unknown>,
) {
  return modals.openConfirmModal({
    title: 'Deseja criar um novo Plano de Tratamento?',
    children: (
      <Text size="sm">
        Clicando em confirmar você cria um novo Plano de Tratamento em branco
        para o paciente {patientName}. Deseja continuar?
      </Text>
    ),
    labels: { confirm: 'Confirmar', cancel: 'Cancelar' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => mutation.mutate(),
  });
}

export default function TreatmentPlansSection({
  patientId,
}: TreatmentPlansSectionProps) {
  const router = useRouter();
  const options = getPatientTratmentPlansOptions(patientId);

  const { data, isLoading } = useQuery({
    ...options,
  });

  const mutation = useMutation({
    mutationFn: () =>
      createPatientTreatmentPlan('4dcfc261-9dc0-4844-bebc-9bcb96293cba'),
    onSuccess: (data) => {
      router.push(`/patients/${patientId}/treatments/${data}`);
    },
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%" miw="400px">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Planos de tratamento
          </Text>
          <ActionIcon
            variant="subtle"
            color="gray"
            disabled={isLoading}
            onClick={() => openTPCreationModal('fulano', mutation)}
          >
            <IconPlus size={16} />
          </ActionIcon>
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
          <TreatmentPlansContent data={data} />
        )}
      </Card.Section>
    </Card>
  );
}

function getLastEmptyYear(
  tpByYear: Map<string, TreatmentPlanShort[]>,
): React.ReactNode | null {
  const years = Array.from(tpByYear.keys()).map(Number);

  if (years.length > 0) {
    const minYear = Math.min(...years);
    return <Timeline.Item title={(minYear - 1).toString()} />;
  }

  return null;
}

function TreatmentPlansContent({ data }: { data: TreatmentPlanShort[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('active');

  function onTreatmentPlanSelect(treatmentPlanId: string) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('active', treatmentPlanId);
    router.push(`?${newParams.toString()}`, { scroll: false });
  }

  if (data.length === 0) {
    return (
      <Center py="md" h="100%" px="lg">
        <Stack align="center">
          <Text fw={600} size="lg" c="dimmed" ta="center">
            O paciente não tem planos de tratamento.
            <br />
            Clique no botão acima para criar um.
          </Text>
        </Stack>
      </Center>
    );
  }

  const treatmentPlansByYear = data.reduce((acc, tp) => {
    const year = tp.updatedAt.getFullYear().toString();
    if (acc.has(year)) {
      acc.get(year)!.push(tp);
    } else {
      acc.set(year, [tp]);
    }
    return acc;
  }, new Map<string, TreatmentPlanShort[]>());

  return (
    <Timeline bulletSize={16}>
      {Array.from(treatmentPlansByYear.entries())
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, plans]) => (
          <Timeline.Item key={year} title={year}>
            <Stack gap="sm" my="xs">
              {plans.map((tp) => (
                <TreatmentPlanCard
                  key={tp.id}
                  treatmentPlan={tp}
                  selected={tp.id === active?.toString()}
                  onSelect={onTreatmentPlanSelect}
                />
              ))}
            </Stack>
          </Timeline.Item>
        ))}
      {getLastEmptyYear(treatmentPlansByYear)}
    </Timeline>
  );
}
