"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { sendContactMessage, type ContactState } from "./actions";

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, action, pending] = useActionState<ContactState, FormData>(
    sendContactMessage,
    { status: "idle" },
  );

  if (state.status === "sent") {
    return (
      <p
        role="status"
        className="rounded-lg border border-success/30 bg-success/10 px-5 py-4 font-bold text-success"
      >
        {t("sent")}
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot. Hidden from people, visible to naive bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div>
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" name="name" required minLength={2} maxLength={80} />
      </div>

      <div>
        <Label htmlFor="channel">{t("channel")}</Label>
        <Input id="channel" name="channel" required minLength={3} maxLength={120} dir="ltr" />
      </div>

      <div>
        <Label htmlFor="message">{t("message")}</Label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          className="w-full rounded-lg border border-border bg-input px-4 py-3 text-base leading-relaxed text-foreground"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="accent" size="lg" disabled={pending}>
          {pending ? t("sending") : t("send")}
        </Button>
        <FieldError>
          {state.status === "error" && t("error")}
          {state.status === "limited" && t("rateLimited")}
        </FieldError>
      </div>
    </form>
  );
}
