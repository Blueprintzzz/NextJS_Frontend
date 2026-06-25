/**
 * (protected) layout — wraps authenticated pages with AuthBootstrap.
 * Validates JWT on mount, redirects to /login if invalid,
 * runs periodic 5-min token check, and syncs logout across tabs.
 */
import { AuthBootstrap } from '@/features/auth';
import { FeatureSidebar } from '@/features/sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthBootstrap>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <FeatureSidebar />
        <main className="flex-1 min-w-0 h-full overflow-hidden">
          {children}
        </main>
      </div>
    </AuthBootstrap>
  );
}
