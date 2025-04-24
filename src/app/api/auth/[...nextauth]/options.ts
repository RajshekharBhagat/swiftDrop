import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
   providers: [
    CredentialsProvider({
        id: 'credentials',
        name: 'Credentials',
        credentials: {
            email : {label: 'Email',type: 'text'},
            password: {label: 'Password', type:'text'}, 
        },
        async authorize(credentials: any): Promise<any> {
            await dbConnect();
            try {
                const user = await UserModel.findOne({email: credentials?.email})
                if(!user) {
                    throw new Error('User not found with this Email.');
                }
                const isMatch = await bcrypt.compare(credentials?.password,user.password);
                if(!isMatch) {
                    throw new Error('Invalid Password.');
                }
                return user;
            } catch (error: any) {
                console.log('Unauthorized Error', error.message);
                throw new Error(error.message)
            }
        }
    })
   ],
   callbacks: {
    async jwt({token,user}) {
        if(user) {
            token.id = user._id;
            token.name = user.name;
            token.role = user.role;
        }
        return token;
    },
    async session ({session, token}) {
        if(token) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.role = token.role;
        }
        return session;
    }
   },
   pages: {
    signIn: '/sign-in',
   },
   session: {
    strategy: 'jwt',
   },
   secret: process.env.NEXT_AUTH_SECRET,
}