import { ptBR } from 'date-fns/locale';
import { format, formatDistanceToNow } from 'date-fns';
import { Timeline, Text, Avatar, Tooltip, Stack } from '@mantine/core';

import { Activity } from '@/shared/models';

interface ActivityItemProps {
  activity: Activity;
  getActivityTitle: (activity: Activity) => string;
}

function getMetadataText(activity: Activity) {
  const metadata = activity.metadata;
  if (!metadata || activity.type === 'CREATED') {
    return '';
  }

  return metadata.data as string;
}

export default function ActivityItem({
  activity,
  getActivityTitle,
}: ActivityItemProps) {
  const metadataText = getMetadataText(activity);

  return (
    <Timeline.Item
      title={getActivityTitle(activity)}
      bullet={
        <Avatar
          size={22}
          radius="xl"
          src={activity.actor.avatarUrl}
          color="white"
        />
      }
    >
      <Stack gap={metadataText ? '6' : '0'} style={{ maxWidth: '600px' }}>
        <Text c="dimmed" size="sm">
          {activity.description}
        </Text>

        {metadataText && (
          <Text c="dimmed" size="sm">
            <b>Observações: </b> {metadataText}
          </Text>
        )}

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
