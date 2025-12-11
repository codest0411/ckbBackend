import { z } from 'zod';

const uuidSchema = z.string().uuid();
const optionalUrl = z
  .string()
  .url('Provide a valid URL.')
  .or(z.string().length(0))
  .optional()
  .transform((val) => (val === '' ? undefined : val));

const slugSchema = z
  .string()
  .min(3)
  .max(80)
  .regex(/^[a-z0-9-]+$/, 'Slug can contain lowercase letters, numbers, and hyphens only.');

const nonEmptyPartial = (schema) =>
  schema.partial().refine((val) => Object.keys(val).length > 0, {
    message: 'Provide at least one field to update.',
  });

export const aboutSchema = z.object({
  id: uuidSchema.optional(),
  headline: z.string().min(4, 'Headline is too short.'),
  bio: z.string().min(20, 'Tell a richer story in the bio.'),
  highlight: z.array(z.string().min(2)).max(8).optional(),
  resume_url: optionalUrl,
});

export const createSkillSchema = z.object({
  name: z.string().min(2, 'Skill name required.'),
  category: z.string().max(60).optional(),
  proficiency: z.number().int().min(0).max(100).optional(),
  icon_url: optionalUrl,
});

export const updateSkillSchema = nonEmptyPartial(createSkillSchema);

export const createProjectSchema = z.object({
  title: z.string().min(3, 'Project title required.'),
  slug: slugSchema,
  summary: z.string().min(5).optional(),
  description: z.string().optional(),
  live_url: optionalUrl,
  repo_url: optionalUrl,
  featured: z.boolean().optional(),
  started_on: z.string().optional(),
  completed_on: z.string().optional(),
});

export const updateProjectSchema = nonEmptyPartial(createProjectSchema);

export const createBlogSchema = z.object({
  title: z.string().min(3),
  slug: slugSchema,
  excerpt: z.string().max(300).optional(),
  content: z.string().min(10).optional(),
  published_at: z.string().optional(),
  preview_image_url: optionalUrl,
  readme: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export const updateBlogSchema = nonEmptyPartial(createBlogSchema);

export const createExperienceSchema = z.object({
  company: z.string().min(2),
  title: z.string().min(2),
  start_date: z.string(),
  end_date: z.string().nullable().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export const updateExperienceSchema = nonEmptyPartial(createExperienceSchema);

export const createTestimonialSchema = z.object({
  author: z.string().min(2),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(10),
  highlight: z.boolean().optional(),
});

export const updateTestimonialSchema = nonEmptyPartial(createTestimonialSchema);

export const createServiceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10).optional(),
  price_range: z.string().optional(),
  duration: z.string().optional(),
  image_url: optionalUrl,
});

export const updateServiceSchema = nonEmptyPartial(createServiceSchema);

export const listQuerySchema = z.object({
  search: z.string().optional(),
});
