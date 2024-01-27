import NextAuth from "next-auth"
import type {Adapter} from "next-auth/adapters";
import {PrismaAdapter} from "@auth/prisma-adapter"
import {PrismaClient} from "@prisma/client"
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";

const prisma = new PrismaClient()

export default NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET_ID as string,
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
    ],
})