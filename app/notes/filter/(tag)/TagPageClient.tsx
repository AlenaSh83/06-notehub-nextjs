"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";

interface TagPageClientProps {
  tag: string;
}

export default function TagPageClient({ tag }: TagPageClientProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["notes", tag],
    queryFn: () =>
      fetchNotes(tag === "All" ? {} : { tag: tag }), // Змінено з search на tag
  });

  if (isLoading) return <p>Loading...</p>;

  if (!data || !data.notes.length) {
    return <p>No notes found for {tag}</p>;
  }

  return (
    <div>
      <h2>Notes tagged: {tag}</h2>
      <ul>
        {data.notes.map((note) => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}