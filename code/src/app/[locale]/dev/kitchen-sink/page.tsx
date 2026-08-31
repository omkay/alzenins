import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AlertTriangle, CalendarDays, Info } from "lucide-react";
import { env } from "@/env";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Progress, SeatMeter } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export const metadata: Metadata = { robots: { index: false, follow: false } };

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section data-sink-section={id} className="flex flex-col gap-4">
      <h2 className="text-xs font-extrabold tracking-widest text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}

/**
 * Every primitive on one page, in both locales, so RTL regressions are caught
 * by a test rather than by a student. Not linked from anywhere and never served
 * off a real host — see the guard below.
 */
export default async function KitchenSink({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Same rule as the E2E code sink: localhost only. A deployed host never
  // satisfies it, so this gallery cannot appear on the real site.
  if (!env.APP_URL.startsWith("http://localhost")) notFound();

  const rtl = locale === "ar";

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-5 py-12 sm:px-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Kitchen sink</h1>
        <p className="mt-2 text-muted-foreground">
          {rtl ? "كل المكوّنات في اتجاه واحد" : "Every primitive, one direction"} — {locale}
        </p>
      </header>

      <Section id="buttons" title="Buttons">
        <Button variant="primary">{rtl ? "احجز مقعدك" : "Reserve a seat"}</Button>
        <Button variant="accent">{rtl ? "ادفع الآن" : "Pay now"}</Button>
        <Button variant="outline">{rtl ? "إلغاء" : "Cancel"}</Button>
        <Button variant="ghost">{rtl ? "تخطّي" : "Skip"}</Button>
        <Button variant="destructive">{rtl ? "احذف" : "Delete"}</Button>
        <Button variant="accent" size="lg">
          <CalendarDays aria-hidden />
          {rtl ? "مع أيقونة" : "With icon"}
        </Button>
        <Button disabled>{rtl ? "غير متاح" : "Disabled"}</Button>
      </Section>

      <Section id="badges" title="Badges">
        <Badge>{rtl ? "مسودة" : "Draft"}</Badge>
        <Badge variant="accent">{rtl ? "الأكثر مبيعاً" : "Bestseller"}</Badge>
        <Badge variant="success">{rtl ? "مدفوع" : "Paid"}</Badge>
        <Badge variant="warning">{rtl ? "بقي 3 مقاعد" : "3 seats left"}</Badge>
        <Badge variant="danger">{rtl ? "فشل الدفع" : "Payment failed"}</Badge>
        <Badge variant="live" dot>{rtl ? "مباشر الآن" : "Live now"}</Badge>
      </Section>

      <Section id="form" title="Form">
        <div className="w-full max-w-sm">
          <Label htmlFor="ks-name">{rtl ? "الاسم" : "Name"}</Label>
          <Input id="ks-name" placeholder={rtl ? "اكتب اسمك" : "Your name"} />
          <FieldError>{rtl ? "هذا الحقل مطلوب" : "This field is required"}</FieldError>
        </div>
        <div className="w-full max-w-sm">
          <Label htmlFor="ks-level">{rtl ? "المستوى" : "Level"}</Label>
          <Select id="ks-level" defaultValue="N5">
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
          </Select>
        </div>
        <div className="w-full max-w-sm">
          <Label htmlFor="ks-msg">{rtl ? "رسالتك" : "Your message"}</Label>
          <Textarea id="ks-msg" rows={3} />
        </div>
        <label className="flex items-center gap-3 text-sm font-semibold">
          <Checkbox defaultChecked id="ks-terms" />
          {rtl ? "أوافق على الشروط" : "I accept the terms"}
        </label>
        <RadioGroup defaultValue="month" className="text-sm font-semibold">
          <label className="flex items-center gap-3">
            <RadioGroupItem value="month" /> {rtl ? "شهري" : "Monthly"}
          </label>
          <label className="flex items-center gap-3">
            <RadioGroupItem value="year" /> {rtl ? "سنوي" : "Annual"}
          </label>
        </RadioGroup>
        <label className="flex items-center gap-3 text-sm font-semibold">
          <Switch defaultChecked id="ks-remind" />
          {rtl ? "ذكّرني قبل الحصة" : "Remind me before class"}
        </label>
      </Section>

      <Section id="feedback" title="Feedback">
        <Alert variant="info" className="w-full">
          <Info aria-hidden />
          <div>
            <AlertTitle>{rtl ? "معلومة" : "Heads up"}</AlertTitle>
            {rtl ? "السعر معروض بالريال، والتحصيل بالدرهم." : "Shown in SAR, charged in AED."}
          </div>
        </Alert>
        <Alert variant="warning" className="w-full">
          <AlertTriangle aria-hidden />
          <div>{rtl ? "بقي مقعدان فقط." : "Only two seats left."}</div>
        </Alert>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Progress value={62} />
          <SeatMeter taken={9} capacity={12} label={rtl ? "المقاعد" : "Seats"} />
          <SeatMeter taken={11} capacity={12} label={rtl ? "شبه ممتلئة" : "Nearly full"} />
          <SeatMeter taken={12} capacity={12} label={rtl ? "ممتلئة" : "Full"} />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Section>

      <Section id="surfaces" title="Surfaces">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{rtl ? "دبلوم اليابانية" : "Japanese Diploma"}</CardTitle>
            <CardDescription>
              {rtl ? "الإثنين والأربعاء · 18:00" : "Monday and Wednesday · 18:00"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span dir="ltr" className="tabular text-2xl font-bold">390</span>{" "}
            <span className="text-sm font-bold text-muted-foreground">
              {rtl ? "د.إ شهرياً" : "AED per month"}
            </span>
          </CardContent>
          <CardFooter>
            <Button variant="accent">{rtl ? "سجّل" : "Enrol"}</Button>
          </CardFooter>
        </Card>
        <div className="flex items-center gap-3">
          <Avatar><AvatarFallback>ر</AvatarFallback></Avatar>
          <Avatar><AvatarFallback>S</AvatarFallback></Avatar>
        </div>
        <Separator className="my-2" />
      </Section>

      <Section id="navigation" title="Navigation">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>{rtl ? "المتجر" : "Store"}</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{rtl ? "كتب" : "Books"}</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Genki I</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">{rtl ? "نظرة عامة" : "Overview"}</TabsTrigger>
            <TabsTrigger value="schedule">{rtl ? "الجدول" : "Schedule"}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">{rtl ? "محتوى النظرة العامة" : "Overview content"}</TabsContent>
          <TabsContent value="schedule">{rtl ? "محتوى الجدول" : "Schedule content"}</TabsContent>
        </Tabs>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="a">
            <AccordionTrigger>{rtl ? "هل أحتاج خبرة سابقة؟" : "Do I need prior experience?"}</AccordionTrigger>
            <AccordionContent>{rtl ? "لا، نبدأ من الصفر." : "No — we start from zero."}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section id="overlay" title="Overlay">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{rtl ? "افتح نافذة" : "Open dialog"}</Button>
          </DialogTrigger>
          <DialogContent closeLabel={rtl ? "إغلاق" : "Close"}>
            <DialogHeader>
              <DialogTitle>{rtl ? "تأكيد الحجز" : "Confirm booking"}</DialogTitle>
              <DialogDescription>
                {rtl ? "سيتم خصم حصة واحدة من رصيدك." : "One session will be deducted."}
              </DialogDescription>
            </DialogHeader>
            <Button variant="accent">{rtl ? "أكّد" : "Confirm"}</Button>
          </DialogContent>
        </Dialog>
      </Section>

      <Section id="table" title="Table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{rtl ? "المجموعة" : "Cohort"}</TableHead>
              <TableHead>{rtl ? "المقاعد" : "Seats"}</TableHead>
              <TableHead>{rtl ? "الحالة" : "Status"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{rtl ? "دبلوم — أ" : "Diploma — A"}</TableCell>
              <TableCell><span dir="ltr" className="tabular">9/12</span></TableCell>
              <TableCell><Badge variant="success">{rtl ? "مفتوحة" : "Open"}</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{rtl ? "دبلوم — ب" : "Diploma — B"}</TableCell>
              <TableCell><span dir="ltr" className="tabular">12/12</span></TableCell>
              <TableCell><Badge variant="danger">{rtl ? "ممتلئة" : "Full"}</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>
    </div>
  );
}
