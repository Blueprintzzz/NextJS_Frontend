'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';

const CATEGORIES = [
  'Cooking Classes', 'Village Tours', 'Boat / Oru Tours', 'Cart Tours',
  'Hiking', 'Cultural Shows', 'Wildlife Safari', 'Water Sports',
  'Tea Factory Tours', 'Camping', 'Other',
];

export default function SupplierProfilePage() {
  const user = useSelector((s: RootState) => s.user.user);
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: '',
    businessName: '',
    businessDescription: '',
    category: '',
    address: '',
    city: '',
    district: '',
    website: '',
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to profile update API
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Supplier Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <Card>
          <CardContent className="pt-6 flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 shrink-0">
              {avatar ? (
                <Image src={avatar} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                  {form.firstName?.[0]?.toUpperCase() ?? 'S'}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            <div>
              <p className="font-semibold text-gray-900">{form.firstName} {form.lastName}</p>
              <p className="text-sm text-gray-500">{form.email}</p>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => fileRef.current?.click()}>
                Change Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+94 77 000 0000" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Business Name</label>
                <Input value={form.businessName} onChange={(e) => set('businessName', e.target.value)} placeholder="Your business name" />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">— Select category —</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Website</label>
                <Input value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://example.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Business Description</label>
              <Textarea
                rows={3}
                value={form.businessDescription}
                onChange={(e) => set('businessDescription', e.target.value)}
                placeholder="Describe your business and the experiences you offer…"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="text-sm font-medium">Address</label>
                <Input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Street address" />
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <Input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="City" />
              </div>
              <div>
                <label className="text-sm font-medium">District</label>
                <Input value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="District" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
