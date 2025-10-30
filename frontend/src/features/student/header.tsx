import { Student } from '@/shared/models';
import { Avatar, Group, Stack, Title, Text, Box, Divider } from '@mantine/core';
import {
  IconBuildingHospital,
  IconCalendar,
  IconIdBadge,
  IconMail,
} from '@tabler/icons-react';

export default function StudentHeader({ student }: { student: Student }) {
  return (
    <Stack
      gap={0}
      bg="white"
      style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}
    >
      <Box pt="xs" m="md">
        <Group justify="space-between">
          <LeftContent student={student} />
          <RightContent student={student} />
        </Group>
      </Box>
    </Stack>
  );
}

function LeftContent({ student }: { student: Student }) {
  return (
    <Group>
      <Avatar
        size={150}
        color="initials"
        variant="light"
        name={student.name}
        src={student.avatarUrl}
      />
      <Stack gap={4}>
        <Title>{student.name}</Title>
        <Stack gap={0}>
          <Group gap={4}>
            <IconMail size={16} />
            <Text>{student.email}</Text>
          </Group>
          <Group>
            <Group gap={4}>
              <IconBuildingHospital size={16} />
              <Text>Clínica {student.clinicNumber}</Text>
            </Group>
            <Group gap={4}>
              <IconCalendar size={16} />
              <Text>
                {student.enrollmentYear}.{student.enrollmentSemester}
              </Text>
            </Group>
            <Group gap={4}>
              <IconIdBadge size={16} />
              <Text>{student.enrollmentCode}</Text>
            </Group>
          </Group>
        </Stack>
      </Stack>
    </Group>
  );
}

function RightContent({ student }: { student: Student }) {
  return (
    <Group>
      <Stack gap={2} align="center">
        <Title order={2} size="h1" c="indigo">
          4
        </Title>
        <Text>Pacientes</Text>
      </Stack>
      <Divider />
      <Stack gap={2} align="center">
        <Title order={2} size="h1" c="indigo">
          74%
        </Title>
        <Text>Meta de Clínica</Text>
      </Stack>
    </Group>
  );
}
