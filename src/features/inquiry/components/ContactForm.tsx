'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateInquiry } from '../hooks/useInquiry';
import type { CreateInquiryInput, InquiryCategory } from '../types/inquiry.types';

const CATEGORIES: InquiryCategory[] = ['BOOKING', 'GENERAL', 'COMPLAINT', 'SUGGESTION'];

const EMPTY: CreateInquiryInput = { name: '', email: '', phone: '', subject: '', message: '', category: 'GENERAL' };

export function ContactForm() {
  const router = useRouter();
  const mutation = useCreateInquiry();
  const [form, setForm] = useState<CreateInquiryInput>(EMPTY);
  const [errors, setErrors] = useState<Partial<CreateInquiryInput>>({});

  const set = <K extends keyof CreateInquiryInput>(k: K, v: CreateInquiryInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Partial<CreateInquiryInput> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.subject.trim()) e.subject = 'Required';
    if (form.message.trim().length < 10) e.message = 'At least 10 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(form, { onSuccess: () => router.push('/inquiry/confirmation') });
  };

  return (
    <Card className="max-w-lg w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Phone (optional)</label>
            <Input type="tel" value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Category *</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value as InquiryCategory)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1"
              suppressHydrationWarning
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Subject *</label>
            <Input value={form.subject} onChange={(e) => set('subject', e.target.value)} />
            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Message *</label>
            <Textarea rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="How can we help you?" />
            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={mutation.isPending}>
            {mutation.isPending ? 'Sending…' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
