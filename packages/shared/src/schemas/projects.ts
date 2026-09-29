import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(120),
  description: z.string().trim().max(1000).default(''),
});

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1, 'Project name is required').max(120).optional(),
    description: z.string().trim().max(1000).optional(),
  })
  .refine(
    (project) => project.name !== undefined || project.description !== undefined,
    'At least one project field is required',
  );

export const projectIdSchema = z.object({
  id: z.string().uuid('Project ID must be a valid UUID'),
});

export const projectListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
