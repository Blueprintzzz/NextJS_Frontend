'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
  () => import('@/features/destination/components/LeafletMap').then((m) => ({ default: m.LeafletMap })),
  { ssr: false, loading: () => null }
);

export default function MapPage() {
  return (
    <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <LeafletMap />
    </div>
  );
}
