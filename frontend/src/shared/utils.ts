import { auth } from '@/shared/auth';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { ProcedureShort, ReviewableShort, TreatmentPlanShort } from './models';

type User = NonNullable<Session['user']>;

export async function requireAuth(): Promise<User> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('User must be authenticated here (middleware bug?)');
  }
  return session.user;
}

export async function getAuthToken(): Promise<string> {
  let session;
  if (typeof window === 'undefined') {
    session = await auth();
  } else {
    session = await getSession();
  }
  if (!session?.user) {
    throw new Error('User must be authenticated here (middleware bug?)');
  }

  return session.user.accessToken;
}

export function getBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.BACKEND_URL ?? 'http://server:8080/api';
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080/api';
}

export type Replace<T, R> = Omit<T, keyof R> & R;

export function formatFileSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let fileSize = size;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function isProcedure(r: ReviewableShort): r is ProcedureShort {
  return r.type === 'PROCEDURE';
}

export function isTreatmentPlan(r: ReviewableShort): r is TreatmentPlanShort {
  return r.type === 'TREATMENT_PLAN';
}
