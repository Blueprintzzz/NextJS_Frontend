'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const role = useAppSelector((state) => state.user.user?.role);

  useEffect(() => {
    if (role && role !== 'ADMIN') router.replace('/');
  }, [role, router]);

  if (!role || role !== 'ADMIN') return null;

  return <>{children}</>;
}
