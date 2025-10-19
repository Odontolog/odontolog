import { Group, Text } from '@mantine/core';
import Link from 'next/link';
import { ElementType, ReactNode } from 'react';

export interface CardInfoProps {
  icon: ElementType;
  text: ReactNode;
  href?: string;
  className?: string;
}

export default function CardInfo({
  icon: Icon,
  text,
  href,
  className,
}: CardInfoProps) {
  const content = (
    <Text size="sm" c="dimmed" style={{ marginTop: '0.125rem' }}>
      {text}
    </Text>
  );

  return (
    <Group gap={4} align="center" className={className}>
      <Icon size={16} color="gray" />

      {href !== undefined ? (
        <Link href={href} style={{ textDecoration: 'none', cursor: 'pointer' }}>
          {content}
        </Link>
      ) : (
        content
      )}
    </Group>
  );
}
