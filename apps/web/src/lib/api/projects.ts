import type {
  CreateProjectInput,
  PaginatedProjects,
  Project,
  UpdateProjectInput,
} from '@core-wrk/shared';
import { PROJECTS_PATH } from '@core-wrk/shared';
import { apiFetch } from './client';

export function listProjects(): Promise<PaginatedProjects> {
  return apiFetch<PaginatedProjects>(PROJECTS_PATH);
}

export function createProject(input: CreateProjectInput): Promise<Project> {
  return apiFetch<Project>(PROJECTS_PATH, { method: 'POST', body: JSON.stringify(input) });
}

export function getProject(id: string): Promise<Project> {
  return apiFetch<Project>(`${PROJECTS_PATH}/${id}`);
}

export function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  return apiFetch<Project>(`${PROJECTS_PATH}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteProject(id: string): Promise<void> {
  return apiFetch<void>(`${PROJECTS_PATH}/${id}`, { method: 'DELETE' });
}
