import type { Metadata } from 'next';
import { Providers } from '@/components/shared/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'sberry',
  description: 'Employee engagement and workforce management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
