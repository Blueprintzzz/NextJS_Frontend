'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from './StarRating';
import { useCreateReview, useUpdateReview } from '../hooks/useReviews';
import type { Review, CreateReviewInput } from '../types/review.types';

interface Props {
  bookingId?: string;
  existingReview?: Review;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ bookingId, existingReview, onSuccess, onCancel }: Props) {
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [title, setTitle] = useState(existingReview?.title ?? '');
  const [description, setDescription] = useState(existingReview?.description ?? '');
  const [imageInput, setImageInput] = useState('');
  const [images, setImages] = useState<string[]>(existingReview?.images ?? []);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    if (rating === 0 || !title.trim() || !description.trim()) return;
    const data: CreateReviewInput = { rating, title: title.trim(), description: description.trim(), images };
    if (existingReview) {
      updateMutation.mutate({ id: existingReview.id, data }, { onSuccess });
    } else if (bookingId) {
      createMutation.mutate({ bookingId, data }, { onSuccess });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Rating *</label>
        <div className="mt-1"><StarRating value={rating} onChange={setRating} size="lg" /></div>
      </div>
      <div>
        <label className="text-sm font-medium">Title *</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summarise your experience" />
      </div>
      <div>
        <label className="text-sm font-medium">Description *</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Share the details of your experience…" />
      </div>
      <div>
        <label className="text-sm font-medium">Photos (optional)</label>
        <div className="flex gap-2 mt-1">
          <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="Image URL" />
          <Button type="button" variant="outline" onClick={() => { if (imageInput.trim()) { setImages((i) => [...i, imageInput.trim()]); setImageInput(''); } }}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {images.map((url, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-0.5 text-xs truncate max-w-[200px]">
              {url}<button onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">×</button>
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        {onCancel && <Button variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button onClick={handleSubmit} disabled={isPending || rating === 0 || !title.trim() || !description.trim()}>
          {isPending ? 'Submitting…' : existingReview ? 'Update Review' : 'Submit Review'}
        </Button>
      </div>
    </div>
  );
}
