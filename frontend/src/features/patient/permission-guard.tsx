import { notFound } from 'next/navigation';

import { checkPermission } from './requests';

export default async function PatientPermissionGuard({
  patientId,
  children,
}: {
  patientId: string;
  children: React.ReactNode;
}) {
  const hasPermission = await checkPermission(patientId);
  if (!hasPermission) {
    notFound();
  }

  return <>{children}</>;
}
