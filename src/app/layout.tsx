import type { Metadata } from 'next';
import { Providers } from '@/components/shared/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'TFX',
  description: 'Employee engagement and workforce management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
