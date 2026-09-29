import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteProject, getProject, updateProject } from '../lib/api/projects';
import { ProjectForm } from '../features/projects/ProjectForm';
import { Button } from '../components/Button';

export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const project = useQuery({
    queryKey: ['projects', id],
    queryFn: () => getProject(id),
    enabled: Boolean(id),
  });
  const update = useMutation({
    mutationFn: (input: { name: string; description: string }) => updateProject(id, input),
    onSuccess: async (updated) => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.setQueryData(['projects', id], updated);
      setEditing(false);
    },
  });
  const remove = useMutation({
    mutationFn: () => deleteProject(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/dashboard');
    },
  });

  if (project.isPending) return <p className="text-slate-500">Loading project…</p>;
  if (project.isError || !project.data)
    return (
      <div>
        <p className="text-red-700">Project could not be found.</p>
        <Link className="mt-4 inline-block font-semibold text-moss" to="/dashboard">
          ← Back to dashboard
        </Link>
      </div>
    );
  const current = project.data;
  return (
    <div className="max-w-2xl">
      <Link className="text-sm font-semibold text-moss" to="/dashboard">
        ← Back to dashboard
      </Link>
      <div className="mt-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-moss">Project</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{current.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
          <Button
            variant="danger"
            disabled={remove.isPending}
            onClick={() => {
              if (window.confirm('Delete this project?')) remove.mutate();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {editing ? (
          <ProjectForm
            initial={current}
            submitLabel="Save changes"
            onSubmit={(input) => update.mutateAsync(input)}
            submitting={update.isPending}
          />
        ) : (
          <>
            <p className="whitespace-pre-wrap leading-7 text-slate-600">
              {current.description || 'No description yet.'}
            </p>
            <p className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-400">
              Created {new Date(current.createdAt).toLocaleDateString()} · Updated{' '}
              {new Date(current.updatedAt).toLocaleDateString()}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
