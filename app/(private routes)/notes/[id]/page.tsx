import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { serverNotesService } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';
import Modal from '@/components/Modal/Modal';
import { redirect } from 'next/navigation';
import type { Note } from '@/types/note';

interface NoteModalPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteModalPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note: Note = await serverNotesService.fetchNoteById(id);

    const description =
      note.content.length > 157
        ? `${note.content.substring(0, 157)}...`
        : note.content;

    return {
      title: `${note.title} | NoteHub`,
      description,
      openGraph: {
        title: `${note.title} | NoteHub`,
        description,
        url: `https://06-notehub-nextjs-rho-gray.vercel.app/notes/${id}`,
        images: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      },
    };
  } catch {
    return {
      title: 'Note Not Found | NoteHub',
      description: 'The requested note could not be found.',
    };
  }
}

export default async function NoteModalPage({ params }: NoteModalPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => serverNotesService.fetchNoteById(id),
    });
  } catch (error) {
    console.error('Failed to fetch note in modal', error);
    redirect('/notes');
  }

  return (
    <Modal onClose={() => redirect('/notes')}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </Modal>
  );
}
