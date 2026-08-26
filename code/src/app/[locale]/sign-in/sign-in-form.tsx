"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";

export function SignInForm({
  callbackUrl,
  googleEnabled,
  showDevHint,
}: {
  callbackUrl: string;
  googleEnabled: boolean;
  showDevHint: boolean;
}) {
  const t = useTranslations("auth");
  const locale = useLocale();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const result = await signIn("email-otp", {
      email: email.trim().toLowerCase(),
      redirect: false,
    });

    setBusy(false);
    if (result?.error) setError(t("errorSend"));
    else setStep("code");
  }

  function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);

    // Auth.js verifies an email token through its callback URL, so the code the
    // student typed is handed back the same way a magic link would have been.
    const url = new URL("/api/auth/callback/email-otp", window.location.origin);
    url.searchParams.set("email", email.trim().toLowerCase());
    url.searchParams.set("token", code.trim());
    url.searchParams.set("callbackUrl", callbackUrl);
    window.location.href = url.toString();
  }

  if (step === "code") {
    return (
      <form onSubmit={verifyCode} className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {t("codeTitle")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("codeSubtitle", { email })}
          </p>
        </div>

        <div>
          <Label htmlFor="code">{t("codeLabel")}</Label>
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoFocus
            dir="ltr"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="tabular text-center text-2xl tracking-[0.4em]"
          />
          <FieldError>{error}</FieldError>
        </div>

        <Button type="submit" variant="accent" size="lg" disabled={busy}>
          {busy ? t("verifying") : t("verify")}
        </Button>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
            className="text-accent-text hover:text-foreground"
          >
            {t("changeEmail")}
          </button>
        </div>

        {showDevHint && (
          <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            {t("devHint")}
          </p>
        )}
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <form onSubmit={requestCode} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            dir="ltr"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={locale === "ar" ? "text-end" : undefined}
          />
          <FieldError>{error}</FieldError>
        </div>

        <Button type="submit" variant="accent" size="lg" disabled={busy}>
          {busy ? t("sending") : t("sendCode")}
        </Button>
      </form>

      {googleEnabled && (
        <>
          <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t("or")}
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => signIn("google", { callbackUrl })}
          >
            {t("google")}
          </Button>
        </>
      )}
    </div>
  );
}
