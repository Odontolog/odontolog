import { Avatar, Stack, Text, Timeline, Tooltip } from '@mantine/core';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { AnamneseActivity, AnamneseEditConditionsMetadata } from '../models';
import EditConditionDetail from './activity-detail/edit-condition-detail';

interface AnamneseActivityItemProps {
  activity: AnamneseActivity;
}

function getMetadata(activity: AnamneseActivity): React.ReactNode | undefined {
  const metadata = activity.metadata;
  if (!metadata) {
    return undefined;
  }

  if (activity.type === 'EDIT_NOTES') {
    return (
      <Text c="dimmed" size="sm">
        <b>Observações: </b> {metadata.data as string}
      </Text>
    );
  }

  if (activity.type === 'EDIT_CONDITIONS') {
    return (
      <EditConditionDetail
        metadata={metadata as AnamneseEditConditionsMetadata}
      />
    );
  }
}

function getTitle(type: AnamneseActivity['type']): string {
  switch (type) {
    case 'EDIT_CONDITIONS':
      return 'História clínica atualizada';
    case 'EDIT_NOTES':
      return 'Observações atualizadas';
  }
}

export default function AnamneseActivityItem({
  activity,
}: AnamneseActivityItemProps) {
  const metadata = getMetadata(activity);

  return (
    <Timeline.Item
      title={getTitle(activity.type)}
      bullet={
        <Avatar
          size={22}
          radius="xl"
          src={activity.actor.avatarUrl}
          color="white"
        />
      }
    >
      <Stack
        gap={metadata !== undefined ? '6' : '0'}
        style={{ maxWidth: '600px' }}
      >
        {activity.description != null && activity.description.trim() !== '' && (
          <Text c="dimmed" size="sm">
            {activity.description}
          </Text>
        )}

        {metadata}

        <Text size="xs" mt={4}>
          <Text variant="link" component="span" inherit fw={600} c="gray.9">
            {activity.actor.name}
          </Text>{' '}
          <Tooltip
            label={format(activity.createdAt, 'dd/MM/yyyy HH:mm')}
            withArrow
            transitionProps={{ duration: 200 }}
          >
            <span>
              {formatDistanceToNow(activity.createdAt, {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </Tooltip>
        </Text>
      </Stack>
    </Timeline.Item>
  );
}
