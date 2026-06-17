'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PassengerForm } from './PassengerForm';
import { useAddPassenger, useRemovePassenger } from '../hooks/usePassengerManagement';
import type { Booking, CreatePassengerInput } from '../types/booking.types';

interface PassengerListProps {
  booking: Booking;
  editable?: boolean;
}

export function PassengerList({ booking, editable }: PassengerListProps) {
  const [showAdd, setShowAdd] = useState(false);
  const addMutation = useAddPassenger(booking.id);
  const removeMutation = useRemovePassenger(booking.id);

  const handleAdd = (data: CreatePassengerInput) => {
    addMutation.mutate(data, { onSuccess: () => setShowAdd(false) });
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Email', 'Phone', 'Date of Birth', 'Passport'].map((h) => (
                <th key={h} className="px-4 py-2 text-left font-medium text-gray-600">{h}</th>
              ))}
              {editable && <th className="px-4 py-2" />}
            </tr>
          </thead>
          <tbody>
            {booking.passengers.length === 0 && (
              <tr><td colSpan={editable ? 6 : 5} className="px-4 py-6 text-center text-gray-400">No passengers added.</td></tr>
            )}
            {booking.passengers.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-4 py-2">{p.passengerName}</td>
                <td className="px-4 py-2">{p.email}</td>
                <td className="px-4 py-2">{p.phone}</td>
                <td className="px-4 py-2">{new Date(p.dateOfBirth).toLocaleDateString()}</td>
                <td className="px-4 py-2">{p.passportNumber ?? '—'}</td>
                {editable && (
                  <td className="px-4 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      disabled={removeMutation.isPending}
                      onClick={() => removeMutation.mutate(p.id)}
                    >
                      Remove
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editable && (
        <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAdd(true)}>
          + Add Passenger
        </Button>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Passenger</DialogTitle></DialogHeader>
          <PassengerForm
            onSubmit={handleAdd}
            onCancel={() => setShowAdd(false)}
            isLoading={addMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
