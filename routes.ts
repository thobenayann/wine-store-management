/**
 * An array of public routes that do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ['/'];

/**
 * An array of routes that require authentication.
 * These routes will redirect logged in users to /settings.
 * @type {string[]}
 */
export const authRoutes = ['/auth/login', '/auth/register', '/auth/error'];

/**
 * The prefix for the API authentication routes.
 * Routes that start with this prefix are used for API authentication.
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after a successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';
