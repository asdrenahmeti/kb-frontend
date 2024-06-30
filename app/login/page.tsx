'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center'>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <Label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </Label>
            <Input
              id='email'
              type='email'
              {...register('email', { required: 'Email is required' })}
              className='mt-1 block w-full'
            />
            {errors.email && (
              <p className='mt-2 text-sm text-red-600'>
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </Label>
            <Input
              id='password'
              type='password'
              {...register('password', { required: 'Password is required' })}
              className='mt-1 block w-full'
            />
            {errors.password && (
              <p className='mt-2 text-sm text-red-600'>
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Button
              type='submit'
              className='bg-kb-primary hover:bg-kb-secondary w-full'
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          {error && (
            <p className='mt-2 text-sm text-red-600 text-center'>{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
