import { Metadata } from 'next';
import css from './not-found.module.css';

export const metadata: Metadata = {
  title: '404 - Page Not Found | NoteHub',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: '404 - Page Not Found | NoteHub',
    description: 'Sorry, the page you are looking for does not exist.',
    url: 'https://06-notehub-nextjs-rho-gray.vercel.app/404',
    images: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
  },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}
