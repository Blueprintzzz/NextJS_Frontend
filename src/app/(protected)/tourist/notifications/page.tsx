'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/store/hooks';
import { apiRequest } from '@/lib/api';
import Link from 'next/link';

type NotifType = 'BOOKING' | 'DRIVER_OFFER' | 'MESSAGE' | 'SYSTEM';
type FilterTab = 'all' | NotifType;

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

const TYPE_ICON: Record<NotifType, string> = {
  BOOKING: '📅',
  DRIVER_OFFER: '🚗',
  MESSAGE: '💬',
  SYSTEM: '🔔',
};

const TYPE_LABEL: Record<NotifType, string> = {
  BOOKING: 'Booking',
  DRIVER_OFFER: 'Driver Offer',
  MESSAGE: 'Message',
  SYSTEM: 'System',
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'BOOKING', label: 'Bookings' },
  { key: 'DRIVER_OFFER', label: 'Driver Offers' },
  { key: 'MESSAGE', label: 'Messages' },
  { key: 'SYSTEM', label: 'System' },
];

export default function NotificationsPage() {
  const orgId = useAppSelector((s) => s.user.user?.id ?? '');
  const qc = useQueryClient();
  const [filter, setFilter] = useState<FilterTab>('all');

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications', orgId],
    queryFn: async () => {
      try { return (await apiRequest('/notifications')) as Notification[]; } catch { return []; }
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications', orgId] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => apiRequest('/notifications/read-all', { method: 'PATCH' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications', orgId] }),
  });

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-gray-500 mt-0.5">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markAllReadMutation.mutate()} disabled={markAllReadMutation.isPending}
            className="text-sm text-teal-600 hover:underline font-medium">
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTER_TABS.map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${filter === t.key ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
          <p className="text-4xl mb-3">🔔</p>
          <p className="font-medium text-gray-700">No notifications</p>
          <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((notif) => {
            const content = (
              <div
                onClick={() => !notif.read && markReadMutation.mutate(notif.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${notif.read ? 'bg-white border-gray-100' : 'bg-teal-50 border-teal-100 hover:bg-teal-50/80'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${notif.read ? 'bg-gray-100' : 'bg-white'}`}>
                  {TYPE_ICON[notif.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />}
                      <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                  <span className="inline-block mt-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{TYPE_LABEL[notif.type]}</span>
                </div>
              </div>
            );

            return notif.actionUrl ? (
              <Link key={notif.id} href={notif.actionUrl}>{content}</Link>
            ) : (
              <div key={notif.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
