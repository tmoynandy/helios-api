/**
 * Prisma seed script. Runs via `npx prisma db seed` after migrations.
 *
 * Uncomment and fill the examples below to insert dev fixtures. The generated
 * package.json wires this script via the `prisma` field so `prisma db seed`
 * picks it up automatically.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");
  // await prisma.post.create({ data: { /* ... */ } });
  // await prisma.user.create({ data: { /* ... */ } });
  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
