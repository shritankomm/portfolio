import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** Newest first. Projects with `endDate` sort by their most recent activity. */
export function sortByDateDesc(a: Project, b: Project) {
  const aKey = a.data.endDate ?? a.data.date;
  const bKey = b.data.endDate ?? b.data.date;
  return bKey.localeCompare(aKey);
}

export async function getAllProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort(sortByDateDesc);
}

export function yearOf(project: Project): string {
  const raw = project.data.endDate ?? project.data.date;
  const match = raw.match(/^\d{4}/);
  return match ? match[0] : 'TODO';
}

export interface YearGroup {
  year: string;
  projects: Project[];
}

/** Groups already-sorted (newest-first) projects by year, preserving order. */
export function groupByYear(projects: Project[]): YearGroup[] {
  const groups: YearGroup[] = [];
  for (const project of projects) {
    const year = yearOf(project);
    const last = groups[groups.length - 1];
    if (last && last.year === year) {
      last.projects.push(project);
    } else {
      groups.push({ year, projects: [project] });
    }
  }
  return groups;
}

/** Number a project by its position within its own year group (§7.2), not global index. */
export function numberWithinYear(group: YearGroup, project: Project): string {
  const index = group.projects.indexOf(project);
  return String(index + 1).padStart(2, '0');
}

export const CATEGORY_LABELS: Record<Project['data']['category'], string> = {
  robotics: 'Robotics',
  software: 'Software',
  competition: 'Competition'
};
