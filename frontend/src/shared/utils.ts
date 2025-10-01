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
