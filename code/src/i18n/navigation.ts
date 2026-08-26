import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Use these instead of `next/link` and `next/navigation` everywhere in the app —
 * they keep the active locale in the URL automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
