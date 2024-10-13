'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner'; // Import toast from sonner
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

type FormData = {
  password: string;
  confirmPassword: string;
};

export default function UserTokenPage() {
  const router = useRouter(); // Use router to navigate after form submission
  const params = useParams();
  const token = Array.isArray(params?.token) ? params?.token[0] : params?.token; // Ensure token is a string

  const [userDetails, setUserDetails] = useState<{ firstName: string; lastName: string, email: string } | null>(null);

  // Fetch user data based on token
  const fetchUserByToken = async (token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/token/${token}`);
    if (!response.ok) {
      throw new Error('Error fetching user data');
    }
    return response.json();
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user', token],
    queryFn: () => fetchUserByToken(token as string),
    enabled: !!token,
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const password = watch('password'); // Watching password to compare for confirmPassword

  useEffect(() => {
    if (data) {
      setUserDetails({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    }
  }, [data]);

  const onSubmit = async (formData: FormData) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'top-center',
      });
      return;
    }

    try {
      // Send the complete profile request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${data.id}/complete-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_password: formData.password }), // Send new_password as per your DTO
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete profile setup');
      }

      // On success, show a success message and redirect
      toast.success('Profile completed successfully', {
        position: 'top-center',
      });
      router.push('/'); // Redirect to login after password change and profile completion
    } catch (err: any) {
      toast.error(err.message, {
        position: 'top-center',
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    toast.error(error?.message || 'Error fetching user data', {
      position: 'top-center',
    });
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 border border-gray-300 rounded shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-4">Complete Profile</h1>

        {userDetails && (
          <div className="mb-4">
            <p><strong>First Name:</strong> {userDetails.firstName}</p>
            <p><strong>Last Name:</strong> {userDetails.lastName}</p>
            <p><strong>Last Name:</strong> {userDetails.email}</p>

          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group mb-4">
            <label htmlFor="password">New Password</label>
            <Input
              type="password"
              id="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full"
            />
            {errors.password && <p className="error-message text-red-500">{errors.password.message}</p>}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className="w-full"
            />
            {errors.confirmPassword && (
              <p className="error-message text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className='bg-kb-primary hover:bg-kb-secondary w-full'>Set Password</Button>
        </form>
      </div>
    </div>
  );
}
