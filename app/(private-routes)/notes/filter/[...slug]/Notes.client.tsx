'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import { fetchNotes } from '@/lib/api/clientApi';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { Note } from '@/types/note';
import css from '../NotePage.module.css';

interface NotesProps {
  initialNotes?: Note[];
  initialTotalPages?: number;
  tag?: string;
}

export default function Notes({
  initialNotes = [],
  initialTotalPages = 0,
  tag,
}: NotesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const tagFilter = tag && tag !== 'All' ? tag : undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', debouncedSearchTerm, currentPage, tagFilter],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: debouncedSearchTerm,
        tag: tagFilter,
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

  const notes = data?.notes || initialNotes;
  const totalPages = data?.totalPages || initialTotalPages;

  if (error) {
    return (
      <div className={css.error}>
        Error loading notes. Please try again later.
      </div>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={handleSearchChange} />
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isLoading && <div className={css.loading}>Loading notes...</div>}

      {notes.length > 0 && <NoteList notes={notes} />}

      {!isLoading && notes.length === 0 && (
        <div className={css.empty}>
          {searchTerm
            ? 'No notes found for your search.'
            : tagFilter
              ? `No notes found for tag "${tag}".`
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
    </div>
  );
}
