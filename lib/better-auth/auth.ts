import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDb } from "../../database/mongoose";
import { nextCookies } from "better-auth/next-js";

let authInstance: Awaited<ReturnType<typeof createAuth>> | null = null;

// separate creator function
const createAuth = async () => {
  const db = await getDb();

  return betterAuth({
    database: mongodbAdapter(db),

    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL,

    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
    },

    plugins: [nextCookies()],
  });
};

// Lazy singleton getter — call this instead of importing a shared instance.
// (No top-level await here: connecting at import time breaks `next build`
// prerendering when the database is unreachable.)
export const getAuth = async () => {
  if (!authInstance) {
    authInstance = await createAuth();
  }
  return authInstance;
};
