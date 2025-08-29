import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { serverAuthService } from '@/lib/api/serverApi';
import { redirect } from 'next/navigation';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'View and manage your NoteHub profile information',
  openGraph: {
    title: 'Profile | NoteHub',
    description: 'View and manage your NoteHub profile information',
    url: 'https://06-notehub-nextjs-rho-gray.vercel.app/profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Profile',
      },
    ],
    type: 'website',
    siteName: 'NoteHub',
  },
};

export default async function ProfilePage() {
  let user;

  try {
    user = await serverAuthService.getProfile();
  } catch {
    redirect('/sign-in');
  }

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src="/avatar-placeholder.svg"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.name || 'your_username'}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
