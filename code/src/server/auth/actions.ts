"use server";

import { signOut } from "./index";

/**
 * Sign-out has to happen server-side.
 *
 * The client-side `signOut()` helper POSTs to /api/auth/signout and then lets
 * the browser navigate. With the JWT strategy, `SessionProvider`'s own
 * /api/auth/session request can land in that window and re-issue the very
 * cookie the sign-out just cleared — so the session survives. Doing it in a
 * server action removes the race, and works with JavaScript disabled.
 */
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
