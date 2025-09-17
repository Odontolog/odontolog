'use client';

import {
  Card,
  Text,
  Group,
  Avatar,
  Loader,
  Center,
  Indicator,
  Box,
  Flex,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { IconExclamationCircle } from '@tabler/icons-react';

import { Reviewable } from '@/shared/models';
import SupervisorMenu from './supervisor-menu';

interface SupervisorSectionProps<T extends Reviewable> {
  reviewableId: string;
  queryOptions: UseQueryOptions<T, Error, T, string[]>;
}

export default function SupervisorSection<T extends Reviewable>({
  reviewableId,
  queryOptions,
}: SupervisorSectionProps<T>) {
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    ...queryOptions,
    select: (data) => data.reviews,
  });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Supervisores
          </Text>
          {reviews && (
            <SupervisorMenu
              reviewableId={reviewableId}
              queryOptions={queryOptions}
              currentReviews={reviews}
            />
          )}
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding p="md">
        {isLoading && (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        )}

        {isError && (
          <Flex align="center" gap="xs">
            <ThemeIcon variant="white" color="red">
              <IconExclamationCircle size={24} />
            </ThemeIcon>
            <Text size="sm" c="red" py="none">
              Erro ao carregar supervisores
            </Text>
          </Flex>
        )}

        {reviews && reviews.length === 0 && (
          <Text size="sm" c="dimmed" ta="center">
            Nenhum supervisor selecionado
          </Text>
        )}

        <Flex gap="xs" direction="column">
          {reviews &&
            reviews.map((review) => (
              <Group key={review.id} justify="space-between" gap="xs">
                <Group gap="xs">
                  <Avatar
                    src={review.supervisor.avatarUrl}
                    size="sm"
                    variant="filled"
                  />
                  <Text size="sm">{review.supervisor.name}</Text>
                </Group>
                <Indicator
                  size={8}
                  position="middle-center"
                  color={
                    review.status === 'approved'
                      ? 'green'
                      : review.status === 'rejected'
                        ? 'red'
                        : review.status === 'draft'
                          ? 'gray'
                          : 'yellow'
                  }
                >
                  <Box w={8} h={8} />
                </Indicator>
              </Group>
            ))}
        </Flex>
      </Card.Section>
    </Card>
  );
}
