/**
 * src/lib/api/index.ts
 *
 * Public API barrel — exports framework-level domains only.
 * Add your domain APIs here as you build new features.
 *
 * Pattern:
 *   export { myDomainApi } from './domains/myDomain.domain';
 */

// Core
export { apiRequest } from './request';
export { ApiError } from './errors';

// Framework domains (always present)
export { authApi } from './domains/auth';
export { usersApi } from './domains/users';
export { departmentsApi, locationsApi } from './domains/departments';
export { organizationsApi } from './domains/organizations';
export { permissionsApi } from './domains/permissions';

// Feature domains — add yours here
// export { exampleApi } from './domains/example.domain';

import { authApi } from './domains/auth';
import { usersApi } from './domains/users';
import { departmentsApi, locationsApi } from './domains/departments';
import { organizationsApi } from './domains/organizations';
import { permissionsApi } from './domains/permissions';

export const api = {
  auth: authApi,
  users: usersApi,
  departments: departmentsApi,
  locations: locationsApi,
  organizations: organizationsApi,
  permissions: permissionsApi,
} as const;

export default api;
