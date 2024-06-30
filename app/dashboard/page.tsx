// app/dashboard/page.tsx

'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string;
      email?: string;
      image?: string;
      role?: string;
    };
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {session && (
        <div>
          <p>Welcome, {session.user.email}</p>
          <p>Your role: {session.user.role}</p>
          <button onClick={handleSignOut}>Logout</button>
        </div>
      )}
    </div>
  );
}
