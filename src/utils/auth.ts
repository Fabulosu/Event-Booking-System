import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { dbConnect } from "./database";
import { UserModel } from "./models";
import bcrypt from "bcrypt";

export const authConfig: NextAuthOptions = {
    pages: {
        signIn: '/login'
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password)
                    return null;
                await dbConnect();
                const user = await UserModel.findOne({
                    $or: [
                        { email: credentials.email },
                        { username: credentials.email }
                    ]
                })
                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    return { id: user._id, username: user.username, email: user.email, profilePicture: user.profilePicture, balance: user.balance }
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update") {
                if (session?.profilePicture) {
                    token.profilePicture = session.profilePicture;
                    console.log(token.profilePicture);
                } else if (session?.username) {
                    token.username = session.username;
                }
            }
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
                token.profilePicture = user.profilePicture;
                token.balance = user.balance;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.profilePicture = token.profilePicture;
                session.user.balance = token.balance;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
}