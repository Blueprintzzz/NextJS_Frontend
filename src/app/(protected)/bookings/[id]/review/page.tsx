'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        return (
          <button key={star} type="button" onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
            className={`text-3xl transition-colors ${star <= (hover || value) ? 'text-amber-400' : 'text-gray-200'}`}>
            ★
          </button>
        );
      })}
    </div>
  );
}

interface ReviewSection {
  key: string;
  label: string;
  icon: string;
  rating: number;
  comment: string;
}

export default function ReviewSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [sections, setSections] = useState<ReviewSection[]>([
    { key: 'driver', label: 'Driver', icon: '🚗', rating: 0, comment: '' },
    { key: 'experience', label: 'Experience', icon: '🎭', rating: 0, comment: '' },
    { key: 'package', label: 'Tour Package', icon: '📦', rating: 0, comment: '' },
  ]);
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateSection = (key: string, field: 'rating' | 'comment', value: number | string) => {
    setSections((prev) => prev.map((s) => s.key === key ? { ...s, [field]: value } : s));
  };

  const overallRating = Math.round(
    sections.filter((s) => s.rating > 0).reduce((sum, s) => sum + s.rating, 0) /
    (sections.filter((s) => s.rating > 0).length || 1)
  );

  const handleSubmit = async () => {
    const rated = sections.filter((s) => s.rating > 0);
    if (rated.length === 0) { toast.error('Please rate at least one category'); return; }
    if (!title.trim()) { toast.error('Please add a review title'); return; }
    setSubmitting(true);
    try {
      await apiRequest(`/bookings/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          bookingId: id,
          rating: overallRating,
          title: title.trim(),
          description: sections.map((s) => s.rating > 0 ? `${s.label}: ${s.comment || 'No comment'}` : null).filter(Boolean).join('\n'),
          driverRating: sections.find((s) => s.key === 'driver')?.rating,
          experienceRating: sections.find((s) => s.key === 'experience')?.rating,
          packageRating: sections.find((s) => s.key === 'package')?.rating,
        }),
      });
      toast.success('Review submitted! Thank you.');
      router.push(`/bookings/${id}`);
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/bookings/${id}`}><button className="text-sm text-gray-500 hover:text-gray-700">← Back</button></Link>
        <h1 className="text-xl font-semibold text-gray-900">Submit Review</h1>
      </div>

      {/* Overall */}
      {overallRating > 0 && (
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center gap-3">
          <span className="text-3xl font-bold text-teal-600">{overallRating}.0</span>
          <div>
            <p className="text-sm font-medium text-teal-700">Overall Rating</p>
            <div className="flex gap-0.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-sm ${i < overallRating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Review Title *</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summarise your experience" />
      </div>

      {/* Rating sections */}
      {sections.map((section) => (
        <div key={section.key} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{section.icon}</span>
            <h2 className="font-semibold text-gray-900">{section.label}</h2>
          </div>
          <StarPicker value={section.rating} onChange={(v) => updateSection(section.key, 'rating', v)} />
          {section.rating > 0 && (
            <Textarea
              value={section.comment}
              onChange={(e) => updateSection(section.key, 'comment', e.target.value)}
              rows={3}
              placeholder={`Share your thoughts about the ${section.label.toLowerCase()}…`}
            />
          )}
        </div>
      ))}

      <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Review'}
      </Button>
    </div>
  );
}
