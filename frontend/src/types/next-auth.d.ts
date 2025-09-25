import { type DefaultSession } from 'next-auth';
import { type JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string;
      accessToken: string;
      name: string;
      email: string;
      photoUrl: string;
      role: 'student' | 'supervisor' | 'admin';
    };
  }

  interface User {
    id: string;
    accessToken: string;
    name: string;
    email: string;
    photoUrl?: string;
    role: 'student' | 'supervisor' | 'admin';
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
    role: 'student' | 'supervisor' | 'admin';
  }
}
