'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { authService } from '@/lib/api/clientApi';
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState('');
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  async function updateProfile(formData: FormData) {
    setIsPending(true);
    try {
      const newUsername = formData.get('username') as string;
      const updatedUser = await authService.updateProfile({ username: newUsername });
      setUser(updatedUser);
      router.push('/profile');
    } catch (error) {
      console.error('Update failed:', error);
      setIsPending(false);
    }
  }

  const handleCancel = () => {
    router.push('/profile');
  };

  if (!user) {
    return null;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar || "https://via.placeholder.com/120x120/cccccc/666666?text=User"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} action={updateProfile}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={username}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isPending}
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
