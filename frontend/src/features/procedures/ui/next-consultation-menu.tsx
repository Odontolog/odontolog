'use client';

import {
  ActionIcon,
  Button,
  Center,
  Loader,
  Menu,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconEdit, IconExclamationCircle } from '@tabler/icons-react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useState } from 'react';

import { getNextConsultationDate, saveNextConsultation } from '../requests';

const MENU_WIDTH = 260;

interface NextConsultationMenuProps {
  patientId: string;
  queryOptions: UseQueryOptions<Error, Date>;
  onSave?: (date: Date) => void;
}

export default function NextConsultationMenu(props: NextConsultationMenuProps) {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  return (
    <Menu
      withinPortal
      position="bottom"
      shadow="sm"
      opened={menuOpened}
      onChange={setMenuOpened}
    >
      <Menu.Target>
        <ActionIcon variant="white" color="gray">
          <IconEdit size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <NextConsultationMenuContent {...props} setMenuOpened={setMenuOpened} />
      </Menu.Dropdown>
    </Menu>
  );
}

interface NextConsultationMenuContentProps extends NextConsultationMenuProps {
  setMenuOpened: (value: boolean) => void;
}

function NextConsultationMenuContent({
  patientId,
  queryOptions,
  setMenuOpened,
  onSave,
}: NextConsultationMenuContentProps) {
  const [date, setDate] = useState<Date>();
  const queryClient = useQueryClient();

  const {
    data: nextConsultation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryOptions.queryKey,
    queryFn: () => getNextConsultationDate(patientId),
  });

  const mutation = useMutation({
    mutationFn: (nextConsultation: Date | undefined) =>
      saveNextConsultation(nextConsultation, patientId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryOptions.queryKey });
      setMenuOpened(false);
      if (onSave && date) {
        onSave(date);
      }
    },
  });

  const handleDateChange = (value: string | null) => {
    if (value === null) {
      return;
    }
    setDate(value !== null ? new Date(`${value}T00:00:00.000`) : undefined);
  };

  if (isLoading) {
    return (
      <Center w={MENU_WIDTH} h={100}>
        <Stack p="xs" gap="sm" w={180} align="center">
          <Loader size="sm" />
        </Stack>
      </Center>
    );
  }

  if (isError) {
    return (
      <Center w={MENU_WIDTH} h={100}>
        <Stack align="center" gap="0">
          <ThemeIcon variant="white" color="red">
            <IconExclamationCircle size={24} />
          </ThemeIcon>
          <Text size="sm" c="red" py="none" ta="center">
            Erro ao carregar a data
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!nextConsultation) {
    return null;
  }

  return (
    <>
      <Menu.Label>
        <Text fw={600} size="sm">
          Escolha a data da próxima consulta
        </Text>
      </Menu.Label>
      <Stack p="xs" gap="sm">
        <DatePickerInput
          placeholder="Selecione uma data"
          popoverProps={{ withinPortal: false }}
          value={date}
          onChange={handleDateChange}
        />
        <Button
          size="xs"
          onClick={() => mutation.mutate(date)}
          loading={mutation.isPending}
        >
          Salvar
        </Button>
      </Stack>
    </>
  );
}
