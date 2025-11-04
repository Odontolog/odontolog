import CardInfo from '@/shared/components/card-info';
import { Student } from '@/shared/models';
import { Avatar, Card, Center, Group, Text } from '@mantine/core';
import {
  IconBuildingHospital,
  IconCalendar,
  IconIdBadge2,
} from '@tabler/icons-react';
import Link from 'next/link';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="sm"
      withBorder
      component={Link}
      href={`/students/${student.id}`}
    >
      <Group wrap="nowrap" w="100%">
        <Center>
          <Avatar
            size="lg"
            src={student?.avatarUrl}
            name={student.name}
            color="initials"
          />
        </Center>

        <div style={{ flex: 1 }}>
          <Text span fw={600} c="gray.9">
            {student.name}
          </Text>

          <Group>
            <CardInfo
              icon={IconBuildingHospital}
              text={`Clínica ${student.clinicNumber}`}
            />
            <CardInfo
              icon={IconCalendar}
              text={`${student.enrollmentYear}.${student.enrollmentSemester}`}
            />
            <CardInfo
              icon={IconIdBadge2}
              text={`Clínica ${student.clinicNumber}`}
            />
          </Group>
        </div>
      </Group>
    </Card>
  );
}
