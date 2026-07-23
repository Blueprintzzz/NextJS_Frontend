'use client';

import { useState } from 'react';
import { Eye, UserCheck, UserX, Trash2 } from 'lucide-react';

type UserRole = 'TOURIST' | 'DRIVER' | 'SUPPLIER';
type UserStatus = 'ACTIVE' | 'INACTIVE';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

// Placeholder — replace with real API hook when user management endpoint is available
function useAdminUsers(_role?: UserRole) {
  return { data: [] as AdminUser[], isLoading: false };
}

const ROLE_TABS: { label: string; value: UserRole }[] = [
  { label: 'Tourists', value: 'TOURIST' },
  { label: 'Drivers', value: 'DRIVER' },
  { label: 'Suppliers', value: 'SUPPLIER' },
];

export default function AdminUsersPage() {
  const [role, setRole] = useState<UserRole>('TOURIST');
  const { data, isLoading } = useAdminUsers(role);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">User Management</h1>

      <div className="flex gap-2 border-b border-gray-200">
        {ROLE_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setRole(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              role === tab.value ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              : data.length === 0
              ? <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No {role.toLowerCase()}s found.</td></tr>
              : data.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'DRIVER' ? 'bg-teal-100 text-teal-700' :
                        user.role === 'SUPPLIER' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded" title="View"><Eye className="w-4 h-4" /></button>
                        {user.status === 'ACTIVE'
                          ? <button className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded" title="Deactivate"><UserX className="w-4 h-4" /></button>
                          : <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Activate"><UserCheck className="w-4 h-4" /></button>
                        }
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Remove"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
