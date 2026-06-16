/**
 * src/lib/api/index.ts
 *
 * Public API barrel — exports framework-level domains only.
 * Add your domain APIs here as you build new features.
 */

// Core
export { apiRequest } from './request';
export { ApiError } from './errors';

// Framework domains
export { authApi } from './domains/auth';

// Feature domains — add yours here
// export { exampleApi } from './domains/example';
