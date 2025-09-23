'use client';

import { Card, Flex, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconCalendar, IconSchool, IconUser } from '@tabler/icons-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { TreatmentPlanShort } from '@/shared/models';
import CardInfo, { CardInfoProps } from './card-info';
import styles from './card.module.css';
import { StatusBadge, StatusIndicator } from './status';

type TreatmentPlanCardField = 'assignee' | 'patient' | 'updated';

interface TreatmentPlanCardProps {
  treatmentPlan: TreatmentPlanShort;
  fields?: TreatmentPlanCardField[];
  onSelect?: (treatmentPlanId: string) => void;
  selected?: boolean;
}

function getTreatmentPlanCardInfoProps(
  type: TreatmentPlanCardField,
  treatmentPlan: TreatmentPlanShort,
): CardInfoProps {
  switch (type) {
    case 'assignee':
      return {
        icon: IconSchool,
        text: treatmentPlan.assignee.name,
        href: `/students/${treatmentPlan.assignee.id}`,
      };
    case 'patient':
      return {
        icon: IconUser,
        text: treatmentPlan.patient.name,
        href: `/patients/${treatmentPlan.patient.id}`,
      };
    case 'updated':
      return {
        icon: IconCalendar,
        text: (
          <Tooltip
            label={format(treatmentPlan.updatedAt, 'dd/MM/yyyy HH:mm')}
            withArrow
            transitionProps={{ duration: 200 }}
          >
            <span>
              {formatDistanceToNow(treatmentPlan.updatedAt, {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </Tooltip>
        ),
      };
    default:
      throw new Error('Procedure card info type not supported.');
  }
}

export default function TreatmentPlanCard(props: TreatmentPlanCardProps) {
  const {
    treatmentPlan,
    fields = ['assignee', 'updated'],
    onSelect,
    selected,
  } = props;

  const borderColor =
    selected !== undefined && selected
      ? '1px solid var(--mantine-color-blue-6)'
      : '1px solid var(--mantine-color-default-border)';

  return (
    <Card
      shadow="sm"
      padding="none"
      radius="md"
      withBorder
      className={selected !== undefined ? styles.cardClickable : undefined}
      bd={borderColor}
      onClick={() => onSelect?.(treatmentPlan.id)}
    >
      <Group gap={0}>
        <Stack p="md" gap="sm" className={styles.root}>
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="xs" justify="start" align="center">
              <Text span fw={600} c="gray.9">
                Plano de Tratamento{' '}
                <Text span c="dimmed" fw={600}>
                  #{treatmentPlan.id}
                </Text>
                <StatusIndicator
                  status={treatmentPlan.status}
                  className={styles.indicator}
                />
              </Text>
            </Group>

            <Group gap="sm" wrap="nowrap" style={{ alignSelf: 'flex-start' }}>
              <StatusBadge
                status={treatmentPlan.status}
                className={styles.badge}
              />
            </Group>
          </Group>

          {treatmentPlan.notes && (
            <Text size="sm" c="dimmed">
              {treatmentPlan.notes}
            </Text>
          )}

          <Flex gap="md" rowGap={0} direction="row" wrap="wrap">
            {fields.map((field, index) => (
              <CardInfo
                key={index}
                {...getTreatmentPlanCardInfoProps(field, treatmentPlan)}
              />
            ))}
          </Flex>
        </Stack>
      </Group>
    </Card>
  );
}
