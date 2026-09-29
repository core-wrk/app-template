import { and, desc, eq } from 'drizzle-orm';
import type { AppDatabase } from '@core-wrk/db';
import { project } from '@core-wrk/db/schema';
import type { CreateProjectInput, UpdateProjectInput } from '@core-wrk/shared';

export class ProjectNotFoundError extends Error {
  constructor() {
    super('Project not found');
    this.name = 'ProjectNotFoundError';
  }
}

export interface ProjectService {
  list(ownerId: string, limit: number, offset: number): Promise<(typeof project.$inferSelect)[]>;
  create(ownerId: string, input: CreateProjectInput): Promise<typeof project.$inferSelect>;
  get(ownerId: string, id: string): Promise<typeof project.$inferSelect>;
  update(
    ownerId: string,
    id: string,
    input: UpdateProjectInput,
  ): Promise<typeof project.$inferSelect>;
  remove(ownerId: string, id: string): Promise<void>;
}

export function createProjectService(db: AppDatabase): ProjectService {
  return {
    async list(ownerId, limit, offset) {
      return db
        .select()
        .from(project)
        .where(eq(project.ownerId, ownerId))
        .orderBy(desc(project.updatedAt))
        .limit(limit)
        .offset(offset);
    },

    async create(ownerId, input) {
      const [created] = await db
        .insert(project)
        .values({ ...input, ownerId })
        .returning();
      if (!created) throw new Error('Project could not be created');
      return created;
    },

    async get(ownerId, id) {
      const [found] = await db
        .select()
        .from(project)
        .where(and(eq(project.id, id), eq(project.ownerId, ownerId)))
        .limit(1);
      if (!found) throw new ProjectNotFoundError();
      return found;
    },

    async update(ownerId, id, input) {
      const [updated] = await db
        .update(project)
        .set({ ...input, updatedAt: new Date() })
        .where(and(eq(project.id, id), eq(project.ownerId, ownerId)))
        .returning();
      if (!updated) throw new ProjectNotFoundError();
      return updated;
    },

    async remove(ownerId, id) {
      const deleted = await db
        .delete(project)
        .where(and(eq(project.id, id), eq(project.ownerId, ownerId)))
        .returning({ id: project.id });
      if (deleted.length === 0) throw new ProjectNotFoundError();
    },
  };
}
