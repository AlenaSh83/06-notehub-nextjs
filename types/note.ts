export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag?: NoteTag | string;
  createdAt: string;
  updatedAt: string;

}
export type CreateNoteParams = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;