import { Metadata } from 'next';
import Notes from './Notes.client';
import type { NoteTag } from '../../../../../types/note';

interface NotesPageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const ALL_TAG = 'All';

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug[0]
    : resolvedParams.slug;
  const tag = slug || 'All';

  const title =
    tag === 'All' ? 'All Notes | NoteHub' : `${tag} Notes | NoteHub`;

  const description =
    tag === 'All'
      ? 'Browse all your notes in NoteHub'
      : `Browse your ${tag.toLowerCase()} notes in NoteHub`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://06-notehub-nextjs-rho-gray.vercel.app/notes/filter/${tag}`,
      images: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug[0]
    : resolvedParams.slug;
  const tag = slug && slug !== ALL_TAG ? (slug as NoteTag) : undefined;

  return <Notes tag={tag} />;
}

export async function generateStaticParams() {
  const tags: (NoteTag | typeof ALL_TAG)[] = [
    'Todo',
    'Work',
    'Personal',
    'Meeting',
    'Shopping',
    ALL_TAG,
  ];
  return tags.map((tag) => ({ slug: [tag] }));
}
