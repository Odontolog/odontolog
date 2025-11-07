import { Student, User } from '@/shared/models';
import StudentHeader from './header';
import { ScrollArea, Stack } from '@mantine/core';
import PatientsSection from '../patients/patients';
import StudentReviewableHistorySection from './reviewables-history';
import { getStudentPatients } from '../patient/requests';

interface StudentPageProps {
  student: Student;
  user: User;
}

export default async function StudentPage({ student, user }: StudentPageProps) {
  const patients = await getStudentPatients(student.id);

  return (
    <>
      <StudentHeader
        student={student}
        user={user}
        patientsTotal={patients.length}
      />
      <ScrollArea w="100%" flex={1}>
        <Stack gap="lg" px="lg" py="md">
          <PatientsSection patients={patients} />
          <StudentReviewableHistorySection studentId={student.id} />
        </Stack>
      </ScrollArea>
    </>
  );
}
