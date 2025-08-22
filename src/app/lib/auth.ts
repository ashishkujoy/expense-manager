import NeonAdapter from '@auth/neon-adapter';
import { AuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { pool } from './db';

export type User = {
    id: number;
    name: string;
    email: string;
}

export const authOptions: AuthOptions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter: NeonAdapter(pool as any) as any,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: 'database',
    },
    callbacks: {
        async session({ session, user }) {
            session.user.id = +user.id;
            return session;
        },
    },
};