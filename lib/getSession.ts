import { auth } from '@/auth';
import { Session } from 'next-auth';

/**
 * Retrieves the current user session.
 * @returns {Promise<Session | null>} A promise that resolves to the current user session, or null if no session exists.
 */
export async function getCurrentUserSession(): Promise<Session | null> {
    const session: Session | null = await auth();

    if (!session) {
        return null;
    }

    return session;
}
