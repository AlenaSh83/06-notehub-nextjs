import { Metadata } from 'next';
import { fetchNotes } from '@/lib/api';
import Notes from './[...slug]/Notes.client'; 
import css from './NotePage.module.css';

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: 'All Notes | NoteHub',
  description: 'Browse and manage all your notes in one place. Filter by tags, search, and organize your personal notes efficiently.',
  keywords: 'notes list, all notes, browse notes, manage notes, filter notes, search notes',
  openGraph: {
    title: 'All Notes | NoteHub',
    description: 'Browse and manage all your notes in one place',
    type: 'website',
    siteName: 'NoteHub',
  },
  twitter: {
    card: 'summary',
    title: 'All Notes | NoteHub',
    description: 'Browse and manage all your notes in one place',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function NotesPage() {
  const { notes, totalPages } = await fetchNotes({ page: 1, perPage: 12 });

  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>All Notes</h1>
      <Notes initialNotes={notes} initialTotalPages={totalPages} />
    </div>
  );
}