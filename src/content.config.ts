import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const YOUTUBE_ID_ERROR =
  'youtube expects an 11-character video ID only (e.g. "9L26LDluzQg"), not a full URL. ' +
  'Strip everything before the ID from youtube.com or youtu.be links.';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) => z
    .object({
      title: z.string(),
      // "YYYY-MM" — used for sort + display. Real dates TBD for seed content; see README TODO list.
      date: z.string(),
      endDate: z.string().optional(),
      status: z.enum(['complete', 'in-progress', 'archived']).default('complete'),
      featured: z.boolean().default(false),
      category: z.enum(['robotics', 'software', 'competition'], {
        errorMap: () => ({
          message: 'category must be one of: "robotics", "software", "competition"'
        })
      }),
      summary: z.string().max(180),
      tech: z.array(z.string()),
      youtube: z
        .string()
        .refine((id) => !/(youtube\.com|youtu\.be)/i.test(id), { message: YOUTUBE_ID_ERROR })
        .refine((id) => /^[A-Za-z0-9_-]{11}$/.test(id), { message: YOUTUBE_ID_ERROR })
        .optional(),
      github: z.string().url().optional(),
      docs: z.string().url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      specs: z
        .array(
          z.object({
            label: z.string(),
            value: z.string()
          })
        )
        .optional()
    })
    .refine((data) => !data.featured || !!data.cover, {
      message: 'cover is required when featured: true — a featured card without an image looks broken',
      path: ['cover']
    })
    .refine((data) => !data.cover || !!data.coverAlt, {
      message: 'coverAlt is required whenever cover is set — describe what is mechanically visible',
      path: ['coverAlt']
    })
});

export const collections = { projects };
