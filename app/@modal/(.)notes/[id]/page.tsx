
import { Metadata } from 'next';
import { fetchNoteById } from "@/lib/api";
import NotePreview from "@/app/@modal/(.)notes/[id]/NotePreview.client";
import { redirect } from "next/navigation";
import type { Note } from '@/types/note';

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  try {
    const note: Note = await fetchNoteById(resolvedParams.id);
    
  
    const description = note.content.length > 157 
      ? `${note.content.substring(0, 157)}...` 
      : note.content;

    return {
      title: `${note.title} | NoteHub`,
      description,
      keywords: `${note.tag || 'note'}, ${note.title}, note details, NoteHub`,
      openGraph: {
        title: note.title,
        description,
        type: 'article',
        siteName: 'NoteHub',
        publishedTime: note.createdAt,
        modifiedTime: note.updatedAt,
        tags: note.tag ? [note.tag] : [],
      },
      twitter: {
        card: 'summary',
        title: note.title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: 'Note Not Found | NoteHub',
      description: 'The requested note could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function NoteModalPage({ params }: Props) {
  const resolvedParams = await params;
  const note = await fetchNoteById(resolvedParams.id);
  
  if (!note) {
    redirect("/notes"); 
  }
  
  return <NotePreview note={note} />;
}
