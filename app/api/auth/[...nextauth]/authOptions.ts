// app/api/auth/[...nextauth]/authOptions.ts
import { NextAuthOptions, User, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { JWT } from 'next-auth/jwt';

// Extend the NextAuth User type
interface ExtendedUser extends User {
  token?: string;
  role?: string;
}

// Extend the NextAuth JWT type
interface ExtendedJWT extends JWT {
  accessToken?: string;
  role?: string;
}

// Extend the NextAuth Session type
interface ExtendedSession extends Session {
  accessToken?: string;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
            {
              email,
              password
            }
          );

          const user: ExtendedUser = response.data;

          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      const extendedToken = token as ExtendedJWT;
      if (user) {
        const extendedUser = user as ExtendedUser;
        extendedToken.accessToken = extendedUser.token;
        extendedToken.role = extendedUser.role;
      }
      return extendedToken;
    },
    async session({ session, token }) {
      const extendedSession = session as ExtendedSession;
      const extendedToken = token as ExtendedJWT;

      extendedSession.accessToken = extendedToken.accessToken;
      if (!extendedSession.user) {
        extendedSession.user = { id: extendedToken.sub || '' };
      }
      extendedSession.user.role = extendedToken.role;
      extendedSession.user.id = extendedToken.sub as string; // Use 'sub' as the user ID
      return extendedSession;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  pages: {
    signIn: '/login' // Define custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET // Ensure this secret is set in your environment variables
};
