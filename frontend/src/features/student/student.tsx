import { Student, User } from '@/shared/models';
import StudentHeader from './header';
import { ScrollArea, Stack } from '@mantine/core';
import PatientsSection from '../patients/patients';
import { getAllPatients } from '../appshell/requests';

interface StudentPageProps {
  student: Student;
  user: User;
}

export default async function StudentPage({ student, user }: StudentPageProps) {
  const patients = await getAllPatients();

  return (
    <>
      <StudentHeader student={student} user={user} />
      <ScrollArea w="100%" flex={1}>
        <Stack px="lg" py="md">
          <PatientsSection patients={patients} />
        </Stack>
      </ScrollArea>
    </>
  );
}
