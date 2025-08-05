
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import css from './NotePage.module.css';

export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  const { notes, totalPages } = await fetchNotes({ page: 1, perPage: 12 });

  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>All Notes</h1>
      <NotesClient initialNotes={notes} initialTotalPages={totalPages} />
    </div>
  );
}

