import StudentHeader from '@/features/student/header';
import { getStudentById } from '@/features/student/requests';

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudentById(id);

  return (
    <>
      <StudentHeader student={student} />
    </>
  );
}
