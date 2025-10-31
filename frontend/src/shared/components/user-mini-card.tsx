'use client';

import { Avatar, Group, Text, Tooltip } from '@mantine/core';

import {
  ProcedureStatus,
  ReviewStatus,
  TreatmentPlanStatus,
  User,
} from '../models';
import { StatusIndicator } from './status';

interface UserMiniCardProps {
  user: User;
  status?: ReviewStatus | TreatmentPlanStatus | ProcedureStatus;
}
export default function UserMiniCard(props: UserMiniCardProps) {
  return (
    <Group justify="space-between" gap="xs" wrap="nowrap">
      <Group gap="xs" wrap="nowrap" style={{ overflowX: 'hidden' }}>
        <Avatar src={props.user.avatarUrl} size="sm" variant="filled" />
        <Tooltip label={props.user.name} openDelay={800}>
          <Text size="sm" truncate>
            {props.user.name}
          </Text>
        </Tooltip>
      </Group>
      {props.status && <StatusIndicator status={props.status} />}
    </Group>
  );
}
