'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api/clientApi';
import type { AuthCredentials } from '@/types/user';
import { AxiosError } from 'axios';
import css from './SignUpPage.module.css';

interface ErrorResponse {
  message?: string;
  error?: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AuthCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      router.push('/profile');
      router.refresh();
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.';
      setError(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    registerMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Registering...' : 'Register'}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
