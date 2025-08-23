import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";
import { redirect } from "next/navigation";

interface NoteModalPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function NoteModalPage({ params }: NoteModalPageProps) {
  
  const resolvedParams = await params;
  const note = await fetchNoteById(resolvedParams.id);

  if (!note) {
    redirect("/notes"); 
  }

  return (
    <Modal onClose={() => redirect("/notes")}>
      <NotePreview note={note} onClose={() => redirect("/notes")} />
    </Modal>
  );
}


