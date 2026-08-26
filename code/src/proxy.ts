import createMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { authConfig } from "@/server/auth/config";
import { routing } from "@/i18n/routing";

const intl = createMiddleware(routing);

// Edge-safe instance: the config here carries no database adapter.
const { auth } = NextAuth(authConfig);

const PROTECTED = /^\/(ar|en)\/(dashboard|profile|teacher|admin)(\/|$)/;

export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (PROTECTED.test(pathname) && !request.auth) {
    const locale = pathname.split("/")[1] || routing.defaultLocale;
    const url = new URL(`/${locale}/sign-in`, request.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return Response.redirect(url);
  }

  return intl(request);
});

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
