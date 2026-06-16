interface TokenPayload {
  role?: string;
  email?: string;
  isSuperAdmin?: boolean;
  [key: string]: unknown;
}

export function decodeTokenPayload(token: string): TokenPayload | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

export function isSuperAdmin(
  userData: { role?: string; email?: string; isSuperAdmin?: boolean },
  payload: TokenPayload | null
): boolean {
  if (userData.isSuperAdmin) return true;
  if (payload?.isSuperAdmin) return true;
  const role = (userData.role ?? payload?.role ?? '').toLowerCase();
  return role === 'superadmin' || role === 'super_admin';
}
