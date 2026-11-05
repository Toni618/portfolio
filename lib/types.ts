export type Skill = { id: number; name: string; level: number };

export type Project = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  repo: string;
  sort: number;
};
