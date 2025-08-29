'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api/clientApi';
import type { AuthCredentials } from '@/types/user';
import { AxiosError } from 'axios';
import css from './LoginForm.module.css';

interface ErrorResponse {
  message?: string;
  error?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AuthCredentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<AuthCredentials>>({});

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      router.push('/notes/filter');
      router.refresh();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Login failed:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Invalid email or password';
      setErrors({
        email: errorMessage,
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthCredentials> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      loginMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AuthCredentials]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={css.input}
          placeholder="Enter your email"
        />
        {errors.email && <span className={css.error}>{errors.email}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={css.input}
          placeholder="Enter your password"
        />
        {errors.password && (
          <span className={css.error}>{errors.password}</span>
        )}
      </div>

      <button
        type="submit"
        className={css.submitButton}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
      </button>

      <p className={css.link}>
        Don&apos;t have an account? <Link href="/sign-up">Sign Up</Link>
      </p>
    </form>
  );
}
