// Match Next's precedence: .env.local wins over .env. `neon link` writes the
// linked branch's DATABASE_URL into .env, so without this, drizzle-kit and the
// seed would silently target the Neon branch instead of local Docker.
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });
import { db, schema } from "./index";

/**
 * Idempotent development seed. Safe to run repeatedly.
 * Real student data is never seeded here — see docs/phases/phase-9-launch.md
 * for the production migration.
 */
async function main() {
  const { users, teacherProfiles } = schema;

  const people = [
    {
      email: "owner@alzenins.test",
      name: "مالك المركز",
      role: "owner" as const,
      country: "AE",
      timezone: "Asia/Dubai",
    },
    {
      email: "amjad@alzenins.test",
      name: "أمجد",
      role: "teacher" as const,
      country: "AE",
      timezone: "Asia/Dubai",
      teacher: {
        headlineAr: "أستاذ اللغة اليابانية — JLPT N1",
        headlineEn: "Japanese instructor — JLPT N1",
        languages: ["ja", "ar", "en"],
        isNativeSpeaker: false,
        isBookable: true,
      },
    },
    {
      email: "rama@alzenins.test",
      name: "راما",
      role: "teacher" as const,
      country: "AE",
      timezone: "Asia/Dubai",
      teacher: {
        headlineAr: "أستاذة اللغة اليابانية — JLPT N1",
        headlineEn: "Japanese instructor — JLPT N1",
        languages: ["ja", "ar"],
        isNativeSpeaker: false,
        isBookable: true,
      },
    },
    {
      email: "anisa@alzenins.test",
      name: "أنيسة",
      role: "teacher" as const,
      country: "AE",
      timezone: "Asia/Dubai",
      teacher: {
        headlineAr: "أستاذة اللغة اليابانية — المجموعات النسائية",
        headlineEn: "Japanese instructor — female-only cohorts",
        languages: ["ja", "ar"],
        isNativeSpeaker: false,
        isBookable: true,
      },
    },
    {
      email: "student@alzenins.test",
      name: "سارة",
      role: "student" as const,
      country: "SA",
      timezone: "Asia/Riyadh",
    },
  ];

  for (const person of people) {
    const { teacher, ...user } = person as (typeof people)[number] & {
      teacher?: Record<string, unknown>;
    };

    const [row] = await db
      .insert(users)
      .values({ ...user, emailVerified: new Date() })
      .onConflictDoUpdate({
        target: users.email,
        set: { name: user.name, role: user.role, updatedAt: new Date() },
      })
      .returning({ id: users.id, email: users.email });

    if (teacher) {
      await db
        .insert(teacherProfiles)
        .values({ userId: row.id, ...teacher })
        .onConflictDoUpdate({
          target: teacherProfiles.userId,
          set: { ...teacher, updatedAt: new Date() },
        });
    }

    console.log(`  ✓ ${row.email} (${user.role})`);
  }

  console.log(`\nSeeded ${people.length} users.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
