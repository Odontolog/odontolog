'use client';

import {
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconArrowRight,
  IconCalendar,
  IconLoader2,
  IconUser,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { getTratmentPlanOptions } from '@/features/treatment-plan/requests';
import CardInfo from '@/shared/components/card-info';
import ProcedureCard from '@/shared/components/procedure-card';
import { StatusBadge } from '@/shared/components/status';

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
            Selecione um plano de tratamento
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

  if (!treatmentPlan || isError) {
    return (
      <Center py="md">
        <Text fw={500} size="lg" c="red">
          Plano de tratamento não encontrado.
        </Text>
      </Center>
    );
  }

  return (
    <>
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between" align="center">
          <Text fw={600} size="lg">
            Plano de Tratamento #{treatmentPlan.id}
          </Text>
          <StatusBadge status={treatmentPlan.status} />
        </Group>
      </Card.Section>

      <Divider />

      <Card.Section p="md" h="100%" style={{ overflowY: 'hidden' }}>
        <ScrollArea
          scrollbarSize={6}
          offsetScrollbars
          scrollbars="y"
          w="100%"
          h="100%"
        >
          <Stack gap="md">
            <Group gap="md">
              <CardInfo icon={IconUser} text={treatmentPlan.author.name} />
              <CardInfo
                icon={IconCalendar}
                text={
                  <Tooltip
                    label={format(treatmentPlan.createdAt, 'dd/MM/yyyy HH:mm')}
                    withArrow
                    transitionProps={{ duration: 200 }}
                  >
                    <span>
                      {formatDistanceToNow(treatmentPlan.createdAt, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </Tooltip>
                }
              />
              <CardInfo
                icon={IconLoader2}
                text={
                  <Tooltip
                    label="Progresso do tratamento"
                    withArrow
                    transitionProps={{ duration: 200 }}
                  >
                    <span>
                      {`${treatmentPlan.procedures.filter((procedure) => procedure.status === 'COMPLETED').length} / ${treatmentPlan.procedures.length.toString()}`}
                    </span>
                  </Tooltip>
                }
              />
            </Group>

            <Stack gap="xs" h="100%">
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
                <Stack gap="md">
                  {treatmentPlan.procedures
                    .sort((a, b) => a.plannedSession - b.plannedSession)
                    .map((procedure) => (
                      <ProcedureCard
                        key={procedure.id}
                        procedure={procedure}
                        fields={['teeth', 'study_sector', 'updated']}
                        onEdit={undefined}
                        onDelete={undefined}
                      />
                    ))}
                </Stack>
              )}
            </Stack>
          </Stack>
          <Flex justify="end" py="lg">
            <Button
              variant="outline"
              component={Link}
              href={`/patients/${treatmentPlan.patient.id}/treatments/${treatmentPlan.id}`}
              color="blue"
              rightSection={<IconArrowRight size={16} />}
              size="xs"
            >
              Ver completo
            </Button>
          </Flex>
        </ScrollArea>
      </Card.Section>
    </>
  );
}
