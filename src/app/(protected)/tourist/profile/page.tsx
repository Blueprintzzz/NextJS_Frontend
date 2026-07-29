'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

type Tab = 'profile' | 'password';

export default function TouristProfilePage() {
  const user = useAppSelector((s) => s.user);
  const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || undefined;
  const [tab, setTab] = useState<Tab>('profile');

  // Profile form
  const [name, setName] = useState(userName ?? '');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  // Password form
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await apiRequest('/users/profile', { method: 'PATCH', body: JSON.stringify({ name: name.trim(), phone: phone.trim() }) });
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setChangingPw(true);
    try {
      await apiRequest('/users/change-password', { method: 'POST', body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }) });
      toast.success('Password changed');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch {
      toast.error('Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>

      {/* Avatar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-3xl font-bold text-teal-600 flex-shrink-0">
          {(userName ?? 'T').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{userName ?? '—'}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <label className="mt-2 inline-block cursor-pointer">
            <span className="text-xs text-teal-600 font-medium hover:underline">Change photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={() => toast.info('Image upload coming soon')} />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['profile', 'password'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'profile' ? 'Personal Info' : 'Change Password'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address</label>
            <Input value={user?.email ?? ''} disabled className="bg-gray-50 text-gray-400" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed here</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone / WhatsApp</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 77 000 0000" />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      )}

      {tab === 'password' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Current Password</label>
            <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">New Password</label>
            <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 8 characters" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Confirm New Password</label>
            <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Repeat new password" />
          </div>
          <Button onClick={handleChangePassword} disabled={changingPw || !currentPw || !newPw || !confirmPw}>
            {changingPw ? 'Changing…' : 'Change Password'}
          </Button>
        </div>
      )}
    </div>
  );
}
