'use client';

import {
  ActionIcon,
  Card,
  Center,
  Divider,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Timeline,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
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

export default function TreatmentPlansSection({
  patientId,
}: TreatmentPlansSectionProps) {
  const router = useRouter();
  const options = getPatientTratmentPlansOptions(patientId);

  const { data, isLoading, isError } = useQuery({
    ...options,
  });

  async function handleConfirm(patientId: string) {
    const newTP: string = await createPatientTreatmentPlan(patientId);
    router.push(`/patients/${patientId}/treatments/${newTP}`);
  }

  function openTPCreationModal() {
    return modals.openConfirmModal({
      title: 'Deseja criar um novo Plano de Tratamento?',
      children: (
        <Text size="sm">
          Clicando em confirmar você cria um novo Plano de Tratamento em branco
          para o paciente. Deseja continuar?
        </Text>
      ),
      labels: { confirm: 'Confirmar', cancel: 'Cancelar' },
      onConfirm: () => {
        void handleConfirm(patientId);
      },
    });
  }

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Planos de tratamento
          </Text>
          <ActionIcon
            variant="subtle"
            color="gray"
            disabled={isLoading}
            onClick={() => openTPCreationModal()}
          >
            <IconPlus size={16} />
          </ActionIcon>
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding px="md" py="sm" h="100%">
        {isError && (
          <Center py="md" h="100%">
            <Text fw={600} size="lg" c="dimmed">
              Algo deu errado. Não foi possível carregar os planos de
              tratamento.
            </Text>
          </Center>
        )}

        {(isLoading || !data) && (
          <Stack h="100%" gap="xs">
            <Skeleton height={120} radius="none" />
            <Skeleton height={120} radius="none" />
            <Skeleton height={120} radius="none" />
            <Skeleton height={120} radius="none" />
          </Stack>
        )}

        {data && (
          <ScrollArea
            scrollbarSize={6}
            offsetScrollbars
            scrollbars="y"
            w="100%"
            h="510px"
          >
            <TreatmentPlansContent data={data} />
          </ScrollArea>
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
  const matches = useMediaQuery('(max-width: 62em)');
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('active');

  function onTreatmentPlanSelect(treatmentPlanId: string, patientId: string) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('active', treatmentPlanId);

    // Check if we're on mobile (below 'md' breakpoint)
    if (matches) {
      router.push(`/patients/${patientId}/treatments/${treatmentPlanId}`);
    } else {
      router.push(`?${newParams.toString()}`, { scroll: false });
    }
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
              {plans
                .sort((a, b) => +b.updatedAt - +a.updatedAt)
                .map((tp) => (
                  <TreatmentPlanCard
                    key={tp.id}
                    treatmentPlan={tp}
                    selected={tp.id === active?.toString()}
                    onSelect={() => onTreatmentPlanSelect(tp.id, tp.patient.id)}
                  />
                ))}
            </Stack>
          </Timeline.Item>
        ))}
      {getLastEmptyYear(treatmentPlansByYear)}
    </Timeline>
  );
}
