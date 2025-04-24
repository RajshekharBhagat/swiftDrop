import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface User {
        _id?: string,
        name?: string,
        role?: 'user' | 'admin',
    }
    interface Session {
        user: {
            id?: string,
            name?: string,
            role?: 'user' | 'admin',
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string,
        name?: string,
        role?: 'user' | 'admin',
    }
}