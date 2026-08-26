import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/site";
import { ContactForm } from "./contact-form";

/** lucide-react v1 dropped brand marks, so this one is drawn inline. */
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  const channels = [
    { icon: Mail, label: t("email"), value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: MessageCircle, label: t("whatsapp"), value: "wa.me", href: CONTACT.whatsapp },
    { icon: InstagramIcon, label: t("instagram"), value: CONTACT.instagramHandle, href: CONTACT.instagram },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        {t("subtitle")}
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-12">
        <div className="rounded-xl border border-border bg-card p-7 shadow-warm">
          <ContactForm />
        </div>

        <aside>
          <h2 className="text-sm font-extrabold text-muted-foreground">
            {t("directTitle")}
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {channels.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted"
                >
                  <Icon className="size-5 shrink-0 text-accent-text" aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-muted-foreground">
                      {label}
                    </span>
                    <span dir="ltr" className="block truncate text-sm font-bold text-foreground">
                      {value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
