'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  Center,
  Divider,
  Group,
  Loader,
  Text,
  Stack,
  Badge,
  Box,
  Button,
} from '@mantine/core';
import { IconCalendar, IconUser, IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import { getTratmentPlanOptions } from '@/features/treatment-plan/requests';
import ProcedureCard from '@/shared/components/procedure-card';

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
    enabled: !!treatmentPlanId,
  });

  if (isLoading) {
    return (
      <Center py="md" h="100%">
        <Loader size="lg" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center py="md">
        <Text fw={600} size="lg" c="red">
          Plano de tratamento não encontrado.
        </Text>
      </Center>
    );
  }

  if (!treatmentPlan) {
    return (
      <Center py="md">
        <Text fw={600} size="lg" c="dimmed">
          Plano não encontrado.
        </Text>
      </Center>
    );
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box style={{ flexShrink: 0 }}>
        <Card.Section inheritPadding py="sm">
          <Stack gap="xs">
            <Group justify="space-between" align="flex-start">
              <Text fw={600} size="lg">
                Plano de Tratamento #{treatmentPlan.id}
              </Text>
              {renderStatusBadge(treatmentPlan.status)}
            </Group>

            <Group gap="md">
              <Group gap="xs">
                <IconUser size={16} />
                <Text size="sm" c="dimmed">
                  Criado por {treatmentPlan.author.name}
                </Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm" c="dimmed">
                  {new Date(treatmentPlan.createdAt).toLocaleDateString(
                    'pt-BR',
                  )}
                </Text>
              </Group>
            </Group>
          </Stack>
        </Card.Section>

        <Divider my="sm" />
      </Box>

      <Box style={{ flex: 1, minHeight: 0, marginBottom: 'auto' }}>
        <Card.Section inheritPadding py="sm" h="100%">
          <Stack gap="md" h="100%">
            <Text fw={600} size="md" style={{ flexShrink: 0 }}>
              Procedimentos
            </Text>

            {treatmentPlan.procedures.length === 0 ? (
              <Center py="md" h="100%">
                <Text size="sm" c="dimmed" ta="center">
                  Nenhum procedimento encontrado neste plano.
                </Text>
              </Center>
            ) : (
              <Box style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                <Stack gap="md">
                  {treatmentPlan.procedures.map((procedure) => (
                    <ProcedureCard
                      key={procedure.id}
                      procedure={procedure}
                      fields={['teeth', 'study_sector', 'updated']}
                      onEdit={undefined}
                      onDelete={undefined}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Card.Section>
      </Box>

      <Box
        style={{
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 'md',
          marginTop: '1.5rem',
          background: 'white',
        }}
      >
        <Button
          variant="outline"
          component={Link}
          href={`/treatment-plans/${treatmentPlan.id}`}
          color="blue"
          rightSection={<IconArrowRight size={16} />}
          size="sm"
          style={{ minWidth: '140px' }}
        >
          Ver completo
        </Button>
      </Box>
    </Box>
  );
}

function renderStatusBadge(status?: string) {
  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'gray' },
    in_review: { label: 'Em Revisão', color: 'orange' },
    in_progress: { label: 'Em Andamento', color: 'blue' },
    done: { label: 'Concluído', color: 'green' },
  };

  const normalizedStatus = status?.toLowerCase() ?? '';
  const { label, color } = statusMap[normalizedStatus];

  return (
    <Badge
      color={color}
      variant="light"
      radius="xl"
      size="lg"
      px="md"
      fw={600}
      tt="capitalize"
      style={{
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </Badge>
  );
}
