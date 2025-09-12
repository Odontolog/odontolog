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
} from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { HasReviewable } from '../models';

import SupervisorMenu from './supervisor-menu';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

interface SupervisorSectionProps {
  queryOptions: UseQueryOptions<HasReviewable, Error, HasReviewable, string[]>;
}

export default function SupervisorSection({
  queryOptions,
}: SupervisorSectionProps) {
  const { data, isLoading, isError } = useQuery({
    ...queryOptions,
    select: (data) => ({
      reviews: data.reviewable.reviews,
      reviewableId: data.reviewableId,
    }),
  });

  return (
    <Card withBorder shadow="sm" radius="md" w={220}>
      <Card.Section withBorder inheritPadding px="sm" py="xs">
        <Group justify="space-between">
          <Text fw={600} size="sm">
            Supervisores
          </Text>
          {data && (
            <SupervisorMenu
              queryOptions={queryOptions}
              reviewableId={data.reviewableId}
              currentReviews={data.reviews}
            />
          )}
        </Group>
      </Card.Section>

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

        {data?.reviews && data?.reviews.length === 0 && (
          <Text size="sm" c="dimmed" ta="center">
            Nenhum supervisor selecionado
          </Text>
        )}

        <Flex gap="xs" direction="column">
          {data &&
            data.reviews.map((review) => (
              <Group key={review.id} justify="space-between" gap="xs">
                <Group gap="xs">
                  <Avatar
                    src={review.supervisor.avatarUrl}
                    size="xs"
                    variant="filled"
                  />
                  <Text size="xs">{review.supervisor.name}</Text>
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
