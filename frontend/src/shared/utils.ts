import { auth } from '@/shared/auth';
import { getSession } from 'next-auth/react';

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
