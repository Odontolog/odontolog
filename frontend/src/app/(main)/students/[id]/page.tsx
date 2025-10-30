import StudentHeader from '@/features/student/header';
import { getStudentById } from '@/features/student/requests';
import { requireAuth } from '@/shared/utils';

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudentById(id);
  const user = await requireAuth();

  return (
    <>
      <StudentHeader student={student} user={user} />
    </>
  );
}
