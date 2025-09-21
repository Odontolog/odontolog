import { Group, Text } from '@mantine/core';
import Link from 'next/link';
import { ElementType } from 'react';

export interface CardInfoProps {
  icon: ElementType;
  text: string;
  href?: string;
}

export default function CardInfo({ icon: Icon, text, href }: CardInfoProps) {
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
