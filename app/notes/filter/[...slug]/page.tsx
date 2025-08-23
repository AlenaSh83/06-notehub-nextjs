import Notes from "../Notes.client";
import type { NoteTag } from "../../../../types/note"; 

interface NotesPageProps {
  params: { slug?: string[] }; 
  searchParams?: Record<string, string | string[] | undefined>;
}

const ALL_TAG = "All";

export default function NotesPage({ params }: NotesPageProps) {
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const tag = slug && slug !== ALL_TAG ? (slug as NoteTag) : undefined;

  return <Notes tag={tag} />;
}


export function generateStaticParams() {
  const tags: (NoteTag | typeof ALL_TAG)[] = ["Todo", "Work", "Personal", "Meeting", "Shopping", ALL_TAG];
  return tags.map(tag => ({ slug: [tag] }));
}

