'use client';

import { useState } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { Note } from '@/types/note';
import css from './NotePage.module.css';

interface NotesProps {
  initialNotes?: Note[];         
  initialTotalPages?: number;     
  tag?: string;
}

export default function Notes({ initialNotes = [], initialTotalPages = 0, tag }: NotesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(tag || '');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', debouncedSearchTerm, currentPage],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: debouncedSearchTerm,
      }),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCreateNote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNoteCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    setIsModalOpen(false);
  };

  const notes = data?.notes || initialNotes;
  const totalPages = data?.totalPages || initialTotalPages;

  if (error) {
    return <div className={css.error}>Error loading notes. Please try again later.</div>;
  }

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={handleSearchChange} />
        <button className={css.button} onClick={handleCreateNote}>
          Create note +
        </button>
      </div>

      {isLoading && <div className={css.loading}>Loading notes...</div>}

      {notes.length > 0 && <NoteList notes={notes} />}

      {!isLoading && notes.length === 0 && (
        <div className={css.empty}>
          {searchTerm
            ? 'No notes found for your search.'
            : 'No notes yet. Create your first note!'}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          currentPage={currentPage - 1}
          onPageChange={handlePageChange}
        />
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onCancel={handleCloseModal} onSubmit={handleNoteCreated} />
        </Modal>
      )}
    </div>
  );
}




