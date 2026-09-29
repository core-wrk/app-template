import { describe, expect, it } from 'vitest';
import { createProjectSchema, updateProjectSchema } from './projects';

describe('project schemas', () => {
  it('trims and defaults project input', () => {
    expect(createProjectSchema.parse({ name: '  Website  ' })).toEqual({
      name: 'Website',
      description: '',
    });
  });

  it('rejects an empty project update', () => {
    expect(() => updateProjectSchema.parse({})).toThrow('At least one project field is required');
  });
});
