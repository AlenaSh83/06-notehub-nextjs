import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import css from './NotePage.module.css';

export const dynamic = 'force-dynamic';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default async function NotesPage() {
  const { notes, totalPages } = await fetchNotes({ page: 1, perPage: 12 });

  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>All Notes</h1>
      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p>No notes yet. Create your first note!</p>
      )}
    </div>
  );
}