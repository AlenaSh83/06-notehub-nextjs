"use client";

import { useRouter } from "next/navigation";
import { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

interface NotePreviewProps {
  note?: Note;
  isLoading?: boolean;
  error?: string;
}

export default function NotePreview({ note, isLoading, error }: NotePreviewProps) {
  const router = useRouter();

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
          <div className={css.error}>
            Error loading note: {error}
          </div>
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