import { Metadata } from 'next';
import css from './Home.module.css';

export const metadata: Metadata = {
  title: 'NoteHub - Your Personal Note Management System',
  description:
    'NoteHub is a simple and efficient application for managing personal notes. Keep your thoughts organized and accessible in one place.',
  keywords:
    'notes, note-taking, productivity, organization, personal notes, todo, work notes',
  openGraph: {
    title: 'NoteHub - Your Personal Note Management System',
    description: 'Simple and efficient application for managing personal notes',
    type: 'website',
    siteName: 'NoteHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoteHub - Your Personal Note Management System',
    description: 'Simple and efficient application for managing personal notes',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Welcome to NoteHub</h1>
        <p className={css.description}>
          NoteHub is a simple and efficient application designed for managing
          personal notes. It helps keep your thoughts organized and accessible
          in one place, whether you are at home or on the go.
        </p>
        <p className={css.description}>
          The app provides a clean interface for writing, editing, and browsing
          notes. With support for keyword search and structured organization,
          NoteHub offers a streamlined experience for anyone who values clarity
          and productivity.
        </p>
      </div>
    </main>
  );
}
