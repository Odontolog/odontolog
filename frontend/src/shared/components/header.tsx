import { Group, Stack, Title, Text } from '@mantine/core';
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  button?: React.ReactNode;
}

export default function Header(props: HeaderProps) {
  const { title, subtitle, button } = props;
  return (
    <header>
      <Group
        justify="space-between"
        px="xl"
        py="md"
        bg="white"
        style={{
          borderBottom: '1px solid var(--mantine-color-default-border)',
        }}
      >
        <Stack gap="0.5rem">
          <Title>{title}</Title>
          <Text>{subtitle}</Text>
        </Stack>
        {button}
      </Group>
    </header>
  );
}
