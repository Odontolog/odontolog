'use client';
import { Menu, Button } from '@mantine/core';
import { IconChevronDown, IconCheck, IconX } from '@tabler/icons-react';
import type { ComponentPropsWithoutRef } from 'react';

type ReviewMenuProps = ComponentPropsWithoutRef<typeof Menu> & {
  buttonProps?: ComponentPropsWithoutRef<typeof Button>;
};

export default function ReviewMenu({
  buttonProps,
  children,
  ...menuProps
}: ReviewMenuProps) {
  return (
    <Menu
      trigger="click-hover"
      openDelay={100}
      closeDelay={400}
      shadow="md"
      width={200}
      {...menuProps}
    >
      <Menu.Target>
        <Button fw={500} rightSection={<IconChevronDown />} {...buttonProps}>
          {children}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<IconCheck size={14} />}>Aprovar</Menu.Item>
        <Menu.Item leftSection={<IconX size={14} />}>Pedir ajustes</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
