import { PublicHeader } from '@/components/public/layout/PublicHeader';
import { PublicFooter } from '@/components/public/layout/PublicFooter';
import { ScrollIndicator } from '@/components/public/layout/ScrollIndicator';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <ScrollIndicator />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}