'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReviewForm } from './ReviewForm';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  bookingId: string;
}

export function CreateReviewModal({ open, onOpenChange, bookingId }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Write a Review</DialogTitle></DialogHeader>
        <ReviewForm bookingId={bookingId} onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
