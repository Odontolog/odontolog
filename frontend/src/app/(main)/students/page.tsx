import { Box } from '@mantine/core';

import { requireAuth } from '@/shared/utils';
import CreateStudentButton from '@/features/students/create-student-button';
import StudentsSection from '@/features/students/students-section';
import Header from '@/shared/components/header';
import { getStudents } from '@/features/students/requests';

export default async function StudentListPage() {
  const user = await requireAuth();
  const students = await getStudents();

  return (
    <>
      <Header
        title="Alunos"
        subtitle="Busque por alunos matriculados nas clínicas."
        {...(user.role !== 'STUDENT' && { button: <CreateStudentButton /> })}
      />
      <Box py="md" px="lg" h="100%">
        <StudentsSection students={students} />
      </Box>
    </>
  );
}
