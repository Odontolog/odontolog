'use client';

import {
  ActionIcon,
  Button,
  Menu,
  Stack,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconEdit, IconExclamationCircle } from '@tabler/icons-react';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';

import { getNextAppointmentOptions, saveNextAppointment } from '../requests';
import { notifications } from '@mantine/notifications';

export default function NextAppointmentMenu({
  patientId,
}: {
  patientId: string;
}) {
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
        <NextAppointmentMenuContent
          patientId={patientId}
          setMenuOpened={setMenuOpened}
        />
      </Menu.Dropdown>
    </Menu>
  );
}

interface NextAppointmentMenuContentProps {
  patientId: string;
  setMenuOpened: (value: boolean) => void;
}

function NextAppointmentMenuContent({
  patientId,
  setMenuOpened,
}: NextAppointmentMenuContentProps) {
  const [date, setDate] = useState<Date>();
  const queryClient = useQueryClient();
  const options = getNextAppointmentOptions(patientId);

  const mutation = useMutation({
    mutationFn: (nextAppointment: Date | undefined) =>
      saveNextAppointment(nextAppointment, patientId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: options.queryKey,
      });
      setMenuOpened(false);
    },
    onError(error) {
      notifications.show({
        title: 'Não foi possível salvar!',
        message: `Um erro inesperado aconteceu e não foi possível salvar a nova data de consulta. Tente novamente mais tarde. ${error}`,
        color: 'red',
        icon: <IconExclamationCircle />,
        autoClose: 5000,
      });
    },
  });

  const handleDateChange = (value: string | null) => {
    if (value === null) {
      return;
    }
    setDate(value !== null ? new Date(`${value}T00:00:00.000`) : undefined);
  };

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
