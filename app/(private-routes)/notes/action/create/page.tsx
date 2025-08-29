import { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

export const metadata: Metadata = {
  title: 'Create New Note | NoteHub',
  description:
    'Create a new note with title, content and tags. Organize your thoughts and ideas in NoteHub.',
  openGraph: {
    title: 'Create New Note | NoteHub',
    description: 'Create a new note with title, content and tags',
    url: 'https://06-notehub-nextjs-rho-gray.vercel.app/notes/action/create',
    images: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
    type: 'website',
    siteName: 'NoteHub',
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
