import { Activity } from '@/shared/models';
import { Timeline, Text, Avatar } from '@mantine/core';

interface ActivityItemProps {
  activity: Activity;
}

function getTitle(activity: Activity) {
  switch (activity.type) {
    case 'created':
      return 'Plano criado';
    case 'edited':
      return 'Plano modificado';
    case 'review_requested':
      return 'Pedido de validação realizado';
    case 'review_approved':
      return 'Plano aprovado';
    case 'review_rejected':
      return 'Plano rejeitado';
  }
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <Timeline.Item
      title={getTitle(activity)}
      bullet={
        <Avatar
          size={22}
          radius="xl"
          src={activity.actor.avatarUrl}
          color="white"
        />
      }
    >
      <Text c="dimmed" size="sm">
        {activity.description}
      </Text>
      <Text size="xs" mt={4}>
        <Text variant="link" component="span" inherit fw={600} c="gray.9">
          {activity.actor.name}
        </Text>{' '}
        às{' '}
        {activity.createdAt.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </Timeline.Item>
  );
}
