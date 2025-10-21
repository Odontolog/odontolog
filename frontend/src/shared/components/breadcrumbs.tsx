import { Anchor, Breadcrumbs, Text } from '@mantine/core';
import { IconSlash } from '@tabler/icons-react';

type BreadcrumbItem = {
  title: string;
  href?: string;
};

interface BreadcrumbProps {
  data: BreadcrumbItem[];
}

export default function CustomBreadcrumbs({ data }: BreadcrumbProps) {
  const breadcrumbsItems = data.map((item, index) => {
    const isLast = index === data.length - 1;

    if (isLast) {
      return (
        <Text size="sm" c="blue" fw={500} key={index}>
          {item.title}
        </Text>
      );
    }

    return (
      <Anchor
        size="sm"
        underline="hover"
        href={item.href}
        key={index}
        c="gray.9"
      >
        {item.title}
      </Anchor>
    );
  });

  return (
    <Breadcrumbs separatorMargin="2" separator={<IconSlash size={16} />}>
      {breadcrumbsItems}
    </Breadcrumbs>
  );
}
