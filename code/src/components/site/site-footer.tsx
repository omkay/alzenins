import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tMeta = useTranslations("meta");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <span className="text-lg font-extrabold">{tMeta("siteName")}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {tMeta("siteTagline")}
          </p>
        </div>

        <nav className="flex flex-col gap-3 text-sm font-semibold text-muted-foreground">
          <Link href="/courses" className="hover:text-foreground">
            {tNav("courses")}
          </Link>
          <Link href="/store" className="hover:text-foreground">
            {tNav("store")}
          </Link>
          <Link href="/about" className="hover:text-foreground">
            {tNav("about")}
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            {tNav("contact")}
          </Link>
        </nav>

        <nav className="flex flex-col gap-3 text-sm font-semibold text-muted-foreground">
          <Link href="/legal/terms" className="hover:text-foreground">
            {t("terms")}
          </Link>
          <Link href="/legal/privacy" className="hover:text-foreground">
            {t("privacy")}
          </Link>
          <Link href="/legal/refunds" className="hover:text-foreground">
            {t("refunds")}
          </Link>
        </nav>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-muted-foreground sm:px-8">
          © <span className="tabular">2026</span> {tMeta("siteName")} — {t("rights")}
        </p>
      </div>
    </footer>
  );
}
