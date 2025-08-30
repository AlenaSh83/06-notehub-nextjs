'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

export default function NotePreview() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.preview}>
          <div className={css.loading}>Loading note...</div>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.preview}>
          <div className={css.error}>Error loading note</div>
          <div className={css.footer}>
            <button onClick={handleClose} className={css.closeButton}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  if (!note) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.preview}>
          <div className={css.error}>Note not found</div>
          <div className={css.footer}>
            <button onClick={handleClose} className={css.closeButton}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.preview}>
        <h2 className={css.title}>{note.title}</h2>
        <p className={css.content}>{note.content}</p>
        {note.tag && <span className={css.tag}>{note.tag}</span>}
        <div className={css.footer}>
          <button onClick={handleClose} className={css.closeButton}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}