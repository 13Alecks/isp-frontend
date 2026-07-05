import NextAuth, { type NextAuthOptions, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { requestApi } from "@/shared/api";
import { AuthSession } from "@/features/auth/types";

type AuthFlow = "login";

type CredentialsInput = {
  flow?: string;
  email?: string;
  password?: string;
};

type AuthenticatedUser = User & {
  token: string;
  firstname?: string;
  lastname?: string;
};

async function authenticateWithBackend(
  credentials?: CredentialsInput
): Promise<AuthenticatedUser | null> {
  if (!credentials) {
    throw new Error("Missing credentials");
  }

  const flow: AuthFlow = credentials.flow === "login" ? "login" : "login";

  let response = null;
  if (flow === "login") {
    response = await requestApi<AuthSession>({
      url: "/auth/login",
      method: "POST",
      body: {
        email: credentials.email ?? "",
        password: credentials.password ?? "",
      },
      auth: "omit",
    });
  }

  if (!response?.success || !response?.data) {
    throw new Error(response?.error || "Authentication failed");
  }

  const session = response.data;

  if (session.status === "error") {
    throw new Error(session.message || "Authentication failed");
  }

  const authToken = session.data.token;
  if (!authToken) {
    throw new Error("Authentication token missing from response");
  }

  return {
    id: String(session.data.user.id),
    email: session.data.user.email,
    firstname: session.data.user.firstname,
    lastname: session.data.user.lastname,
    token: authToken,
  };
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        flow: { label: "Flow", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return authenticateWithBackend(credentials as CredentialsInput);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const authUser = user as AuthenticatedUser;
        const { token: accessToken } = authUser;
        token.accessToken = accessToken;
        token.user = {
          id: String(authUser.id),
          email: authUser.email ?? "",
          firstname: authUser.firstname,
          lastname: authUser.lastname,
        };
        token.email = authUser.email;
        token.sub = String(authUser.id);
      }

      if (trigger === "update" && session?.user?.token) {
        token.accessToken = session.user.token;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user || !token.accessToken || !token.user) {
        return session;
      }

      session.user = {
        ...token.user,
        token: token.accessToken,
      };

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
