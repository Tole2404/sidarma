import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  user?: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "USER";
  };
};

export const defaultSession: SessionData = {};

export const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "majun_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.user) {
    return null;
  }

  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return {
    user: session.user,
  };
}
