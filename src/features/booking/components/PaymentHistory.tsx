'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PaymentForm } from './PaymentForm';
import { BookingAPI } from '../api/booking.api';
import { formatCurrency } from '../utils/booking.utils';

interface PaymentHistoryProps {
  bookingId: string;
  remainingAmount: number;
  editable?: boolean;
}

export function PaymentHistory({ bookingId, remainingAmount, editable }: PaymentHistoryProps) {
  const [showForm, setShowForm] = useState(false);
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['bookings', 'payments', bookingId],
    queryFn: () => BookingAPI.getPaymentHistory(bookingId),
    enabled: !!bookingId,
  });

  const totalPaid = payments.reduce((sum, p) => sum + (p.status === 'SUCCESS' ? p.amount : 0), 0);

  if (isLoading) return <div className="h-20 rounded bg-gray-100 animate-pulse" />;

  return (
    <div>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Date', 'Amount', 'Method', 'Transaction ID', 'Status'].map((h) => (
                <th key={h} className="px-4 py-2 text-left font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No payments recorded.</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-4 py-2">{new Date(p.paymentDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-2">{p.paymentMethod.replace('_', ' ')}</td>
                <td className="px-4 py-2">{p.transactionId ?? '—'}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs font-medium ${p.status === 'SUCCESS' ? 'text-green-600' : p.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Paid: <span className="font-semibold text-green-700">{formatCurrency(totalPaid)}</span>
          {' · '}Remaining: <span className="font-semibold text-red-600">{formatCurrency(remainingAmount)}</span>
        </div>
        {editable && remainingAmount > 0 && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>+ Record Payment</Button>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <PaymentForm bookingId={bookingId} remainingAmount={remainingAmount} onSuccess={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
