import { auth } from '@/shared/auth';
import type { Session } from 'next-auth';

type User = NonNullable<Session['user']>;

export async function requireAuth(): Promise<User> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('User must be authenticated here (middleware bug?)');
  }
  return session.user;
}
