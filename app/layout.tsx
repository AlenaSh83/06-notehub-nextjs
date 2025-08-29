import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import { AuthProvider } from '@/components/AuthProvider/AuthProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Toaster } from 'react-hot-toast';

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://06-notehub-nextjs-rho-gray.vercel.app'),
  title: 'NoteHub - Your Personal Note Management System',
  description:
    'Manage your notes efficiently with NoteHub. Organize, search, and access your personal notes, todos, work notes, and meeting notes in one place.',
  openGraph: {
    title: 'NoteHub - Your Personal Note Management System',
    description:
      'Manage your notes efficiently with NoteHub. Organize, search, and access your personal notes in one place.',
    url: 'https://06-notehub-nextjs-rho-gray.vercel.app',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - Note Management System',
      },
    ],
    type: 'website',
    siteName: 'NoteHub',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={roboto.className}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <Toaster position="top-right" />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
