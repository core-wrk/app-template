import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Project } from '@core-wrk/shared';
import { Button } from '../../components/Button';

interface ProjectFormProps {
  initial?: Pick<Project, 'name' | 'description'>;
  submitLabel?: string;
  submitting?: boolean;
  onSubmit: (input: { name: string; description: string }) => Promise<unknown> | void;
}

export function ProjectForm({
  initial,
  submitLabel = 'Create project',
  submitting = false,
  onSubmit,
}: ProjectFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Give your project a name first.');
      return;
    }
    setError('');
    await onSubmit({ name: name.trim(), description: description.trim() });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink" htmlFor="project-name">
          Name
        </label>
        <input
          id="project-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none ring-moss/20 transition placeholder:text-slate-400 focus:border-moss focus:ring-4"
          placeholder="Website refresh"
          maxLength={120}
        />
      </div>
      <div>
        <label
          className="mb-1.5 block text-sm font-semibold text-ink"
          htmlFor="project-description"
        >
          Description
        </label>
        <textarea
          id="project-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-28 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none ring-moss/20 transition placeholder:text-slate-400 focus:border-moss focus:ring-4"
          placeholder="What are you working on?"
          maxLength={1000}
        />
      </div>
      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
