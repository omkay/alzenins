"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { MARKETS } from "@/lib/markets";
import { cn } from "@/lib/utils";
import { updateProfile, type ProfileState } from "./actions";

const selectClass =
  "h-12 w-full rounded-lg border border-border bg-input px-4 text-base text-foreground";

export function ProfileForm({
  defaults,
  timezones,
}: {
  /**
   * Computed on the server and passed down: Node's ICU and the browser's ICU
   * ship different tz databases, so calling Intl.supportedValuesOf() on both
   * sides produces a hydration mismatch.
   */
  timezones: string[];
  defaults: {
    name: string;
    email: string;
    locale: "ar" | "en";
    country: string;
    timezone: string;
    role: string;
  };
}) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const [state, action, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    { ok: false },
  );

  return (
    <form action={action} className="flex flex-col gap-6">
      <div>
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" name="name" defaultValue={defaults.name} required maxLength={80} />
      </div>

      <div>
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" dir="ltr" defaultValue={defaults.email} disabled className={cn(locale === "ar" && "text-end")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="locale">{t("locale")}</Label>
          <select id="locale" name="locale" defaultValue={defaults.locale} className={selectClass}>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <Label htmlFor="country">{t("country")}</Label>
          <select id="country" name="country" defaultValue={defaults.country} className={selectClass}>
            {MARKETS.map((m) => (
              <option key={m.country} value={m.country}>
                {locale === "ar" ? m.nameAr : m.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="timezone">{t("timezone")}</Label>
        <select id="timezone" name="timezone" defaultValue={defaults.timezone} className={selectClass} dir="ltr">
          {timezones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
        {state.ok && !pending && (
          <span role="status" className="text-sm font-bold text-success">
            {t("saved")}
          </span>
        )}
        <FieldError>{state.error}</FieldError>
      </div>
    </form>
  );
}
