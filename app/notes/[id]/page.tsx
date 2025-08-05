
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;   
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  
  const { id } = await params;
  const noteId = Number(id);

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['note', noteId],
      queryFn: () => fetchNoteById(noteId),
    });
  } catch {
    
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
