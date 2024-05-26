import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';
import NextAuth, { type DefaultSession } from 'next-auth';
import authConfig from './auth.config';
import { getUserById } from './data/user';
import prisma from './lib/db';

// Extend the default session with custom properties
// source : https://authjs.dev/getting-started/typescript
declare module 'next-auth' {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            role: UserRole;
            /**
             * By default, TypeScript merges new interface properties and overwrites existing ones.
             * In this case, the default session user properties will be overwritten,
             * with the new ones defined above. To keep the default session user properties,
             * you need to add them back into the newly declared interface.
             */
        } & DefaultSession['user'];
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    events: {
        // Link the user provider account to the user account (on our DB)
        linkAccount: async ({ user }) => {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // Gestion de l'authentification Google
            if (account?.provider === 'google' && profile) {
                const email = profile.email as string;
                const firstName = profile.given_name || '';
                const lastName = profile.family_name || '';

                // Vérifier si l'utilisateur existe déjà dans la base de données
                let existingUser = await prisma.user.findUnique({
                    where: { email },
                });

                // Si l'utilisateur n'existe pas, le créer
                if (!existingUser) {
                    existingUser = await prisma.user.create({
                        data: {
                            email,
                            first_name: firstName,
                            last_name: lastName,
                            image: profile.picture,
                            emailVerified: new Date(),
                            password: '',
                        },
                    });
                } else {
                    // Si l'utilisateur existe, mettre à jour ses informations
                    existingUser = await prisma.user.update({
                        where: { email },
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                            image: profile.picture,
                        },
                    });
                }

                // Préparer les données du compte OAuth
                const accountData = {
                    provider: account.provider,
                    type: account.type,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    userId: existingUser.id,
                };

                // Vérifier si le compte OAuth existe déjà
                const existingAccount = await prisma.account.findUnique({
                    where: {
                        provider_providerAccountId: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        },
                    },
                });

                // Si le compte OAuth n'existe pas, le créer
                if (!existingAccount) {
                    await prisma.account.create({
                        data: accountData,
                    });
                } else {
                    // Si le compte OAuth existe, mettre à jour ses informations
                    await prisma.account.update({
                        where: {
                            provider_providerAccountId: {
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                            },
                        },
                        data: accountData,
                    });
                }

                // Associer l'utilisateur à l'ID de l'utilisateur existant
                user.id = existingUser.id;
                return true; // Autoriser la connexion pour Google
            }

            // Gestion de l'authentification par identifiants (Credentials)
            if (account?.provider === 'credentials') {
                if (!user.id) {
                    return false; // Refuser la connexion si l'utilisateur n'a pas d'ID
                }

                const existingUser = await getUserById(user.id);

                // Vérifier que l'utilisateur existe
                if (!existingUser) {
                    return false;
                }

                // Si l'email de l'utilisateur n'est pas vérifié, le mettre à jour
                if (existingUser.emailVerified === null) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { emailVerified: new Date() },
                    });
                }

                return true; // Autoriser la connexion pour Credentials
            }

            return false; // Refuser la connexion si aucune condition n'est remplie
        },
        async session({ token, session }) {
            // add the user id to the session (custom field)
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            // Get any information we need for the user based on the token
            // and give it to extend the session upside
            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;

            token.role = existingUser.role;

            return token;
        },
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    ...authConfig,
});
