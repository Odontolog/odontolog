'use client';

import {
  ActionIcon,
  Card,
  Flex,
  Group,
  Menu,
  Stack,
  Text,
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
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { ElementType } from 'react';

import { ProcedureShort } from '@/shared/models';
import styles from './procedure-card.module.css';
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
  onEdit?: (procedure: ProcedureShort) => void;
  onDelete?: (procedure: ProcedureShort) => void;
  fields?: ProcedureCardField[];
}

export default function ProcedureCard(props: ProcedureCardProps) {
  const {
    procedure,
    onEdit,
    onDelete,
    fields = ['teeth', 'study_sector'],
  } = props;
  const hasActions: boolean = !!(onEdit || onDelete);

  return (
    <Card shadow="sm" padding="none" radius="md" withBorder>
      <Group gap={0}>
        <Group p="lg" gap={4}>
          <IconCalendarClock size={20} color="gray" />
          <Text size="md" c="dimmed">
            {procedure.plannedSession}
          </Text>
        </Group>

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
              {hasActions && <ProcedureCardMenu {...props} />}
            </Group>
          </Group>

          {procedure.notes && (
            <Text size="sm" c="dimmed">
              {procedure.notes}
            </Text>
          )}

          <Flex gap="md" rowGap={0} direction="row" wrap="wrap">
            {fields.map((field, index) => (
              <ProcedureCardInfo
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

interface ProcedureCardInfoProps {
  icon: ElementType;
  text: string;
  href?: string;
}

function getProcedureCardInfoProps(
  type: ProcedureCardField,
  procedure: ProcedureShort,
): ProcedureCardInfoProps {
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
        text: formatDistanceToNow(procedure.updatedAt, {
          addSuffix: true,
          locale: ptBR,
        }),
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

export function ProcedureCardInfo({
  icon: Icon,
  text,
  href,
}: ProcedureCardInfoProps) {
  return (
    <Group gap={4} align="center">
      <Icon size={16} color="gray" />

      {href !== undefined ? (
        <Link href={href} style={{ textDecoration: 'none' }}>
          <Text
            size="sm"
            c="dimmed"
            style={{ cursor: 'pointer', marginTop: '0.125rem' }}
          >
            {text}
          </Text>
        </Link>
      ) : (
        <Text size="sm" c="dimmed" style={{ marginTop: '0.125rem' }}>
          {text}
        </Text>
      )}
    </Group>
  );
}
