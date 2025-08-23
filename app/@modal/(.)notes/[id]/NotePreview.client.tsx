"use client";

import { Note } from "@/types/note";
import css from "./NotePreview.module.css";

interface NotePreviewProps {
  note: Note;
  onClose: () => void;
}

export default function NotePreview({ note, onClose }: NotePreviewProps) {
  return (
    <div className={css.preview}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <span className={css.tag}>{note.tag}</span>
      <div className={css.footer}>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
