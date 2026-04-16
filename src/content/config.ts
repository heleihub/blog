import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string().default('XiaoHe'),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string().optional(),
    coverImage: z.string().optional(),
    published: z.boolean().default(true),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  posts,
};