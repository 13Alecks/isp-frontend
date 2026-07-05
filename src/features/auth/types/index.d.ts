import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      token: string;
      email: string;
      firstname?: string;
      lastname?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    token: string;
    firstname?: string;
    lastname?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id: string;
      email: string;
      firstname?: string;
      lastname?: string;
    };
  }
}

export type AuthResponseStatus = "success" | "error";

export interface AuthUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

export interface AuthData {
  token: string;
  user: AuthUser;
}

export interface AuthSession {
  status: AuthResponseStatus | string;
  message: string;
  data: AuthData;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserSessionResponse {
  status: AuthResponseStatus | string;
  message: string;
  data: AuthUser;
  error: string;
}
