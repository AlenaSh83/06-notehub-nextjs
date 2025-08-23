import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";
import { redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function NoteModalPage({ params }: Props) {
  const note = await fetchNoteById(params.id);

  if (!note) {
    redirect("/notes"); 
  }

  return (
    <Modal onClose={() => redirect("/notes")}>
      <NotePreview note={note} onClose={() => redirect("/notes")} />
    </Modal>
  );
}

