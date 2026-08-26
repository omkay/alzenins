import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { UserMenu } from "./user-menu";
import { BrandMark } from "./brand-mark";

const links = [
  { href: "/", key: "home" },
  { href: "/courses", key: "courses" },
  { href: "/store", key: "store" },
  { href: "/about", key: "about" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const tMeta = useTranslations("meta");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="text-lg font-extrabold tracking-tight">
              {tMeta("siteName")}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="rounded-full px-4 py-2 text-[0.95rem] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
