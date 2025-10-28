import { type DefaultSession } from 'next-auth';
import { type JWT as DefaultJWT } from 'next-auth/jwt';
import { UserRole } from '@/shared/models';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string;
      accessToken: string;
      name: string;
      email: string;
      photoUrl: string;
      role: UserRole;
      firstAccess: boolean;
    };
  }

  interface User {
    id: string;
    accessToken: string;
    name: string;
    email: string;
    photoUrl?: string;
    role: UserRole;
    firstAccess: boolean;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    id: string;
    accessToken: string;
    photoUrl?: string;
    email: string;
    name: string;
    role: UserRole;
    firstAccess: boolean;
  }
}
