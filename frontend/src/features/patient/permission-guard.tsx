import { notFound } from 'next/navigation';
import { type User } from 'next-auth';

import { checkPermission } from './requests';

export default async function PatientPermissionGuard({
  user,
  patientId,
  children,
}: {
  user: User;
  patientId: string;
  children: React.ReactNode;
}) {
  const hasPermission = await checkPermission(patientId, user.id);
  if (!hasPermission) {
    notFound();
  }

  return <>{children}</>;
}
