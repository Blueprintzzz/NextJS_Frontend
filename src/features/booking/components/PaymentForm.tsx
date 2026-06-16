'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePaymentRecording } from '../hooks/usePaymentRecording';
import { formatCurrency } from '../utils/booking.utils';

const METHODS = ['CARD', 'BANK_TRANSFER', 'CASH', 'ONLINE'] as const;

interface PaymentFormProps {
  bookingId: string;
  remainingAmount: number;
  onSuccess?: () => void;
}

export function PaymentForm({ bookingId, remainingAmount, onSuccess }: PaymentFormProps) {
  const [amount, setAmount] = useState(String(remainingAmount));
  const [method, setMethod] = useState<string>('CASH');
  const [transactionId, setTransactionId] = useState('');
  const [amountError, setAmountError] = useState('');
  const mutation = usePaymentRecording();

  const needsTransactionId = method === 'CARD' || method === 'ONLINE';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0 || parsed > remainingAmount) {
      setAmountError(`Amount must be between 0.01 and ${formatCurrency(remainingAmount)}`);
      return;
    }
    setAmountError('');
    mutation.mutate(
      { bookingId, amount: parsed, paymentMethod: method, transactionId: transactionId || undefined },
      { onSuccess }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">Remaining balance: <span className="font-semibold text-gray-900">{formatCurrency(remainingAmount)}</span></p>

      <div>
        <label className="text-sm font-medium">Payment Method *</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {METHODS.map((m) => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Amount *</label>
        <Input
          type="number"
          min="0.01"
          step="0.01"
          max={remainingAmount}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {amountError && <p className="text-xs text-red-500 mt-1">{amountError}</p>}
      </div>

      {needsTransactionId && (
        <div>
          <label className="text-sm font-medium">Transaction ID</label>
          <Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Optional" />
        </div>
      )}

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? 'Processing…' : 'Record Payment'}
      </Button>
    </form>
  );
}
