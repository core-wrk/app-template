export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PaginatedProjects {
  items: Project[];
  limit: number;
  offset: number;
}
