import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';
import Modal from '@/components/Modal/Modal';
import { redirect } from 'next/navigation';

interface NoteModalPageProps {
  params: Promise<{ id: string }>; 
}

export default async function NoteModalPage({ params }: NoteModalPageProps) {
  const { id } = await params; 

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id),
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





