import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createProject, listProjects } from '../lib/api/projects';
import { ProjectForm } from '../features/projects/ProjectForm';
import { useSession } from '../hooks/use-session';

export function DashboardPage() {
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const projects = useQuery({ queryKey: ['projects'], queryFn: listProjects });
  const create = useMutation({
    mutationFn: createProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowCreate(false);
    },
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-moss">Your workspace</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Good morning, {session?.user.name.split(' ')[0]}.
          </h1>
          <p className="mt-2 text-slate-600">Keep the next useful thing moving.</p>
        </div>
        <button
          className="rounded-lg bg-moss px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? 'Close form' : 'New project'}
        </button>
      </div>
      {showCreate && (
        <section className="mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">Create a project</h2>
          <ProjectForm
            onSubmit={(input) => create.mutateAsync(input)}
            submitting={create.isPending}
          />
        </section>
      )}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Projects</h2>
          {projects.data && (
            <span className="text-sm text-slate-500">{projects.data.items.length} shown</span>
          )}
        </div>
        {projects.isPending && <p className="mt-6 text-slate-500">Loading projects…</p>}
        {projects.isError && (
          <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            Could not load projects. Check that the API and database are running.
          </p>
        )}
        {projects.data?.items.length === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-semibold">Nothing here yet.</p>
            <p className="mt-2 text-sm text-slate-500">Create your first project to get started.</p>
          </div>
        )}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {projects.data?.items.map((project) => (
            <Link
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-moss hover:shadow-md"
              to={`/projects/${project.id}`}
              key={project.id}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold group-hover:text-moss">{project.name}</h3>
                <span className="text-slate-400 transition group-hover:translate-x-1">→</span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                {project.description || 'No description yet.'}
              </p>
              <p className="mt-5 text-xs text-slate-400">
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
