'use client';

import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Group,
  Loader,
  Menu,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconEdit, IconExclamationCircle } from '@tabler/icons-react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useState } from 'react';

interface NextConsultationMenuProps {
    actualConsultationDate?: string;
    onSave?: (date: string) => void;
}

