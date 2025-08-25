import { Metadata } from 'next';
import TagPageClient from './TagPageClient';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  
  const title = tag === 'All' 
    ? 'All Notes | NoteHub'
    : `${tag} Notes | NoteHub`;
    
  const description = tag === 'All'
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

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  return <TagPageClient tag={tag} />;
}

