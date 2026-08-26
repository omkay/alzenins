import type { DefaultSession } from "next-auth";

type Role = "student" | "teacher" | "admin" | "owner";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}

export {};
