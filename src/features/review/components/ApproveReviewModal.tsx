'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useApproveReview, useRejectReview } from '../hooks/useReviews';
import type { Review } from '../types/review.types';

interface Props {
  review: Review | null;
  onClose: () => void;
}

export function ApproveReviewModal({ review, onClose }: Props) {
  const approveMutation = useApproveReview();
  const rejectMutation = useRejectReview();

  if (!review) return null;

  return (
    <Dialog open={!!review} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Review Moderation</DialogTitle></DialogHeader>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium">{review.userName}</span> · {review.rating}/5</p>
          <p className="font-medium">{review.title}</p>
          <p className="text-gray-600">{review.description}</p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={rejectMutation.isPending}
            onClick={() => rejectMutation.mutate(review.id, { onSuccess: onClose })}
          >
            {rejectMutation.isPending ? 'Rejecting…' : 'Reject'}
          </Button>
          <Button
            disabled={approveMutation.isPending}
            onClick={() => approveMutation.mutate(review.id, { onSuccess: onClose })}
          >
            {approveMutation.isPending ? 'Approving…' : 'Approve'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
