import { Suspense } from 'react';

import { requireAuth } from '@/shared/utils';
import PatientPermissionGuard from '@/features/patient/permission-guard';
import Loading from '@/shared/components/loading';

export default async function PatientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const user = await requireAuth();

  if (user.role === 'STUDENT') {
    return (
      <Suspense fallback={<Loading message="Carregando prontuário" />}>
        <PatientPermissionGuard patientId={patientId}>
          {children}
        </PatientPermissionGuard>
      </Suspense>
    );
  }

  return <>{children}</>;
}
