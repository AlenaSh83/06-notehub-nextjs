'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api/clientApi';
import type { AuthCredentials } from '@/types/user';
import { AxiosError } from 'axios';
import css from './RegisterForm.module.css';

interface ErrorResponse {
  message?: string;
  error?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AuthCredentials>({
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<
    Partial<AuthCredentials & { confirmPassword?: string }>
  >({});

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      router.push('/notes/filter');
      router.refresh();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Registration failed:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Registration failed. Please try again.';
      setErrors({
        email: errorMessage,
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthCredentials & { confirmPassword?: string }> =
      {};

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      registerMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'confirmPassword') {
      setConfirmPassword(value);
      if (errors.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof AuthCredentials]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
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

      <div className={css.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          className={css.input}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <span className={css.error}>{errors.confirmPassword}</span>
        )}
      </div>

      <button
        type="submit"
        className={css.submitButton}
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? 'Creating account...' : 'Sign Up'}
      </button>

      <p className={css.link}>
        Already have an account? <Link href="/sign-in">Sign In</Link>
      </p>
    </form>
  );
}
