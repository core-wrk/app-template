import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProjectForm } from './ProjectForm';

describe('ProjectForm', () => {
  it('requires a project name before submitting', () => {
    const onSubmit = vi.fn();
    render(<ProjectForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Create project' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Give your project a name first.');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed project fields', () => {
    const onSubmit = vi.fn();
    render(<ProjectForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '  Website  ' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: '  A plan  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create project' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Website', description: 'A plan' });
  });
});
