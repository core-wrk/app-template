import { config } from 'dotenv';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { createDb, schema } from '../client';

config({
  path: [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '../../.env.local'),
  ],
});
config();

const db = createDb();
const seedUserId = 'starter-seed-user';

async function seed() {
  await db
    .insert(schema.user)
    .values({
      id: seedUserId,
      name: 'Starter User',
      email: 'starter@example.com',
      emailVerified: true,
    })
    .onConflictDoNothing({ target: schema.user.id });

  const existing = await db
    .select({ id: schema.project.id })
    .from(schema.project)
    .where(eq(schema.project.ownerId, seedUserId))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(schema.project).values({
      name: 'Example project',
      description: 'A seeded project to confirm the starter is connected.',
      ownerId: seedUserId,
    });
  }

  console.log(
    'Database seed complete. Use starter@example.com only as sample data; sign up for a real account.',
  );
}

seed()
  .catch((error: unknown) => {
    console.error('Database seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$client.end();
  });
