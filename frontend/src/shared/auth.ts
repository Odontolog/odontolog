import NextAuth, { CredentialsSignin, type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

class InvalidCredentialsError extends CredentialsSignin {
  code = 'INVALID_CREDENTIALS';
  constructor(message: string) {
    super(message);
    this.message = message;
  }
  override stack = '';
}

class ServerDownError extends CredentialsSignin {
  code = 'SERVER_DOWN';
  constructor(message: string) {
    super(message);
    this.message = message;
  }
  override stack = '';
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: { signIn: '/login' },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // One day
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const payload = {
          username: credentials.email,
          password: credentials.password,
        };

        let token_res;
        try {
          token_res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (error) {
          throw new ServerDownError('Not able to connect to server.');
        }

        if (!token_res.ok) {
          throw new InvalidCredentialsError('Invalid credentials provided.');
        }

        if (token_res.status === 200) {
          const data = (await token_res.json()) as { accessToken: string };
          const user_res = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
            },
          });

          const user = (await user_res.json()) as User;
          user.accessToken = data.accessToken;
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user !== undefined) {
        return {
          ...token,
          ...user,
        };
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          token: token.token,
          username: token.username,
          email: token.email,
          role: token.role,
          accessToken: token.accessToken,
        },
      };
    },
  },
});
