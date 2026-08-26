import Link from "next/link";
import "./globals.css";

/**
 * Root-level 404 for paths that never reach the [locale] segment. It has to
 * render its own <html>/<body> because no locale layout wraps it.
 */
export default function RootNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-dvh items-center justify-center p-6">
        <div className="flex flex-col items-start gap-5">
          <h1 className="text-3xl font-extrabold tracking-tight">
            الصفحة غير موجودة
          </h1>
          <p className="text-muted-foreground">
            الرابط الذي فتحته لم يعد موجوداً أو تغيّر.
          </p>
          <Link
            href="/ar"
            className="inline-flex h-12 items-center rounded-lg bg-accent px-6 font-bold text-accent-foreground"
          >
            العودة للرئيسية
          </Link>
        </div>
      </body>
    </html>
  );
}
