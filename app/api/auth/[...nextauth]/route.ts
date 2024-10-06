import NextAuth from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

// You don't need to export 'authOptions' here in this API file.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
