import { auth } from '@/shared/auth';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

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
