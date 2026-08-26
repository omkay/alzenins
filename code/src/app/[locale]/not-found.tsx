import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function LocaleNotFound() {
  const t = useTranslations("common");

  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-5 px-5 py-28 sm:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">
        {t("notFoundTitle")}
      </h1>
      <p className="text-muted-foreground">{t("notFoundBody")}</p>
      <Link href="/">
        <Button variant="accent">{t("backHome")}</Button>
      </Link>
    </div>
  );
}
