'use client';

import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Skeleton,
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

export default function TreatmentPlanDetailSection({
  scrollAreaHeight,
}: {
  scrollAreaHeight?: string;
}) {
  const searchParams = useSearchParams();
  const active = searchParams.get('active');

  return (
    <Card withBorder shadow="sm" radius="md" px="sm" h="100%" miw="400px">
      {active !== null ? (
        <TreatmentPlanDetailContent
          treatmentPlanId={active}
          scrollAreaHeight={scrollAreaHeight}
        />
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
  scrollAreaHeight?: string;
}

export function TreatmentPlanDetailContent({
  treatmentPlanId,
  scrollAreaHeight = '610px',
}: TreatmentPlanDetailContentProps) {
  const options = getTratmentPlanOptions(treatmentPlanId);
  const {
    data: treatmentPlan,
    isLoading,
    isError,
  } = useQuery({
    ...options,
    enabled: !!treatmentPlanId,
  });

  if (isLoading) {
    return <TPDetailsSkeleton />;
  }

  if (isError) {
    return (
      <Center py="md">
        <Text fw={500} size="lg" c="red">
          Plano de tratamento não encontrado.
        </Text>
      </Center>
    );
  }

  if (!treatmentPlan) {
    return (
      <Center py="md">
        <Text fw={500} size="lg" c="dimmed">
          Plano não encontrado.
        </Text>
      </Center>
    );
  }

  return (
    <Box>
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between" align="center">
          <Text fw={600} size="lg">
            Plano de Tratamento #{treatmentPlan.id}
          </Text>
          <StatusBadge status={treatmentPlan.status} />
        </Group>
      </Card.Section>

      <Divider />

      <Card.Section inheritPadding py="sm" h="100%">
        <ScrollArea
          scrollbarSize={6}
          offsetScrollbars
          scrollbars="y"
          w="100%"
          h={scrollAreaHeight}
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
            <Stack gap="xs" h="100%">
              <Text fw={600} size="md" style={{ flexShrink: 0 }}>
                Observações
              </Text>

              <Text
                size="sm"
                c={treatmentPlan.notes ? 'black' : 'dimmed'}
                style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
              >
                {treatmentPlan.notes || 'Nenhum valor definido'}
              </Text>
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
    </Box>
  );
}

function TPDetailsSkeleton() {
  return (
    <Box h="100%">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between" align="center">
          <Skeleton h={16} w="40%" />
          <Skeleton height={16} radius="xl" width="15%" />
        </Group>
      </Card.Section>

      <Divider />

      <Card.Section inheritPadding py="sm" h="100%">
        <Stack gap="md" flex="1">
          <Group gap="md">
            <Skeleton h={12} w="12%" />
            <Skeleton h={12} w="12%" />
            <Skeleton h={12} w="12%" />
          </Group>
          <Skeleton h={120} />
          <Skeleton h={120} />
        </Stack>

        <Flex justify="end" py="lg">
          <Button
            variant="outline"
            disabled
            color="blue"
            rightSection={<IconArrowRight size={16} />}
            size="xs"
          >
            Ver completo
          </Button>
        </Flex>
      </Card.Section>
    </Box>
  );
}
