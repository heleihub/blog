import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getCategories } from '../lib/content';

export const GET: APIRoute = async () => {
  const allPosts = await getCollection('posts');
  const categoryDefinitions = await getCategories();
  const categoryNameMap = new Map<string, string>();
  categoryDefinitions.forEach((cat: any) => {
    categoryNameMap.set(cat.slug || cat.id, cat.name);
  });

  const searchData = allPosts.map(post => ({
    title: post.data.title,
    slug: post.slug,
    excerpt: post.data.excerpt || '',
    date: post.data.date,
    author: post.data.author,
    category: post.data.category || '',
    categoryName: categoryNameMap.get(post.data.category || '') || post.data.category || '',
    tags: post.data.tags || [],
    coverImage: post.data.coverImage || '',
  }));

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
