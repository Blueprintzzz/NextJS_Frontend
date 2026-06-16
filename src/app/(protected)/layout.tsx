/**
 * (protected) layout
 *
 * Server Component shell — renders the AuthBootstrap client component
 * which owns all browser-side auth logic, then wraps authenticated
 * content in the sidebar + main content shell.
 *
 * Auth behaviour (matches V1 ProtectedRoute exactly):
 *   - Validates JWT from localStorage on mount
 *   - Redirects unauthenticated users to /login
 *   - Enforces org selection before rendering children
 *   - Runs periodic 5-minute token validation
 *   - Syncs logout across browser tabs via storage events
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
      <div className="flex min-h-screen bg-gray-50">
        <FeatureSidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </AuthBootstrap>
  );
}
