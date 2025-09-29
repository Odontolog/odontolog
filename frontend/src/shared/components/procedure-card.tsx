'use client';

import {
  ActionIcon,
  Card,
  Flex,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendar,
  IconCalendarClock,
  IconDental,
  IconDots,
  IconEdit,
  IconMessage,
  IconNotebook,
  IconSchool,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Mode, ProcedureShort } from '@/shared/models';
import CardInfo, { CardInfoProps } from './card-info';
import styles from './card.module.css';
import { StatusBadge, StatusIndicator } from './status';

type ProcedureCardField =
  | 'assignee'
  | 'patient'
  | 'reviews'
  | 'teeth'
  | 'updated'
  | 'study_sector';

interface ProcedureCardProps {
  procedure: ProcedureShort;
  fields?: ProcedureCardField[];
  disableSession?: boolean;
  onEdit?: (procedure: ProcedureShort) => void;
  onDelete?: (procedure: ProcedureShort) => void;
  selected?: boolean;
  onSelect?: (procedureId: string) => void;
  mode?: Mode;
}

function getProcedureCardInfoProps(
  type: ProcedureCardField,
  procedure: ProcedureShort,
): CardInfoProps {
  switch (type) {
    case 'assignee':
      return {
        icon: IconSchool,
        text: procedure.assignee.name,
        href: `/students/${procedure.assignee.id}`,
      };
    case 'patient':
      return {
        icon: IconUser,
        text: procedure.patient.name,
        href: `/patients/${procedure.patient.id}`,
      };
    case 'teeth':
      return {
        icon: IconDental,
        text: procedure.teeth.join(', '),
      };
    case 'updated':
      return {
        icon: IconCalendar,
        text: (
          <Tooltip
            label={format(procedure.updatedAt, 'dd/MM/yyyy HH:mm')}
            withArrow
            transitionProps={{ duration: 200 }}
          >
            <span>
              {formatDistanceToNow(procedure.updatedAt, {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </Tooltip>
        ),
      };
    case 'reviews':
      return {
        icon: IconMessage,
        text: `${procedure.reviews.filter((rev) => rev.status === 'approved').length}/${procedure.reviews.length}`,
      };
    case 'study_sector':
      return {
        icon: IconNotebook,
        text: procedure.studySector,
      };
    default:
      throw new Error('Procedure card info type not supported.');
  }
}

export default function ProcedureCard(props: ProcedureCardProps) {
  const {
    disableSession,
    procedure,
    onEdit,
    onDelete,
    fields = ['teeth', 'study_sector'],
    onSelect,
    selected,
    mode = 'edit',
  } = props;
  const hasActions: boolean = !!(onEdit || onDelete);
  const showOptionsMenu: boolean = mode === 'edit' && hasActions;

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
      onClick={() => onSelect?.(procedure.id)}
    >
      <Group gap={0}>
        {disableSession === false && (
          <Group p="lg" gap={4} miw={82} justify="center">
            <IconCalendarClock size={20} color="gray" />
            <Text size="md" c="dimmed">
              {procedure.plannedSession}
            </Text>
          </Group>
        )}

        <Stack p="md" gap="sm" className={styles.root}>
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="xs" justify="start" align="center">
              <Text span fw={600} c="gray.9">
                {procedure.name}{' '}
                <Text span c="dimmed" fw={600}>
                  #{procedure.id}
                </Text>
                <StatusIndicator
                  status={procedure.status}
                  className={styles.indicator}
                />
              </Text>
            </Group>

            <Group gap="sm" wrap="nowrap" style={{ alignSelf: 'flex-start' }}>
              <StatusBadge status={procedure.status} className={styles.badge} />
              {showOptionsMenu && <ProcedureCardMenu {...props} />}
            </Group>
          </Group>

          {procedure.notes && (
            <Text size="sm" c="dimmed">
              {procedure.notes}
            </Text>
          )}

          <Flex gap="md" rowGap={0} direction="row" wrap="wrap">
            {fields.map((field, index) => (
              <CardInfo
                key={index}
                {...getProcedureCardInfoProps(field, procedure)}
              />
            ))}
          </Flex>
        </Stack>
      </Group>
    </Card>
  );
}

function ProcedureCardMenu(props: ProcedureCardProps) {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <IconDots size={16} color="gray" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Opções do procedimento</Menu.Label>
        {props.onEdit && (
          <Menu.Item
            leftSection={<IconEdit size={14} />}
            onClick={() => props.onEdit?.(props.procedure)}
          >
            Editar
          </Menu.Item>
        )}
        {props.onDelete && (
          <Menu.Item
            leftSection={<IconTrash size={14} />}
            onClick={() => props.onDelete?.(props.procedure)}
          >
            Excluir
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
