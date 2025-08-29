import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | NoteHub',
    default: 'Authentication | NoteHub',
  },
  description: 'Sign in or create an account to access NoteHub',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="auth-layout">{children}</div>;
}
