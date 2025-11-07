import { getStudentById } from '@/features/student/requests';
import StudentPage from '@/features/student/student';
import { requireAuth } from '@/shared/utils';

export default async function Student({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudentById(id);
  const user = await requireAuth();

  return (
    <>
      <StudentPage student={student} user={user} />
    </>
  );
}
