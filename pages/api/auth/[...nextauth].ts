import { env } from "@/lib/env";
import { prisma } from "@/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const githubId = env.GITHUB_ID;
const githubSecret = env.GITHUB_SECRET;

if (!githubId || !githubSecret) {
  throw new Error("Missing environment variables for authentication");
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  theme: {
    colorScheme: "dark",
    logo: "/images/logo-text.png",
  },
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.image = user.image;
      return session;
    },
  },
};

export default NextAuth(authOptions);
