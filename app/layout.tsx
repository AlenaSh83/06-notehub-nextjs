import './globals.css';
import type { Metadata } from 'next';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Manage your notes efficiently',
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode; 
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          <Toaster position="top-right" />
          {children}
          {modal} {}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
