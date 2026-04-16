import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = './content/posts';
const CATEGORIES_FILE = './content/categories.json';
const TAGS_FILE = './content/tags.json';
const COMMENTS_DIR = './content/comments';
const ANNOUNCEMENTS_FILE = './content/config/announcements.json';

export async function getAllPosts() {
  const files = await fs.readdir(POSTS_DIR);
  const posts = [];
  
  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
    
    const filePath = path.join(POSTS_DIR, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const { data, content: postContent } = matter(content);
    
    posts.push({
      slug: file.replace(/\.(md|mdx)$/, ''),
      title: data.title || '',
      date: data.date || '',
      author: data.author || '',
      category: data.category || '',
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      coverImage: data.coverImage || '',
      published: data.published !== false,
      content: postContent,
    });
  }
  
  return posts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data, content: postContent } = matter(content);
    
    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      author: data.author || '',
      category: data.category || '',
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      coverImage: data.coverImage || '',
      published: data.published !== false,
      content: postContent,
    };
  } catch {
    return null;
  }
}

export async function getCategories() {
  try {
    const data = await fs.readFile(CATEGORIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function getCategoriesFromPosts() {
  const posts = await getAllPosts();
  const categoryMap = new Map<string, { id: string, name: string, slug: string, count: number }>();

  posts.forEach(post => {
    if (post.category) {
      const existing = categoryMap.get(post.category);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(post.category, {
          id: post.category,
          name: post.category.charAt(0).toUpperCase() + post.category.slice(1),
          slug: post.category,
          count: 1
        });
      }
    }
  });

  return Array.from(categoryMap.values());
}

export async function getTags() {
  try {
    const data = await fs.readFile(TAGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function getPostsByCategory(categorySlug) {
  const posts = await getAllPosts();
  return posts.filter(post => post.category === categorySlug);
}

export async function getPostsByTag(tagSlug) {
  const posts = await getAllPosts();
  return posts.filter(post => post.tags.includes(tagSlug));
}

export async function getAnnouncements() {
  try {
    const data = await fs.readFile(ANNOUNCEMENTS_FILE, 'utf-8');
    const config = JSON.parse(data);
    return config.announcements.filter(a => a.active);
  } catch {
    return [];
  }
}

export async function getComments(postSlug) {
  const filePath = path.join(COMMENTS_DIR, `${postSlug}.json`);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveComment(postSlug, comment) {
  const filePath = path.join(COMMENTS_DIR, `${postSlug}.json`);
  let comments = [];
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    comments = JSON.parse(data);
  } catch {
    // File doesn't exist yet, start with empty array
  }
  
  comment.id = Date.now().toString();
  comment.createdAt = new Date().toISOString();
  comment.approved = false;
  comment.replies = comment.replies || [];
  
  comments.push(comment);
  
  await fs.writeFile(filePath, JSON.stringify(comments, null, 2));
  return comment;
}

export async function getAllComments() {
  const allComments = [];
  
  try {
    const files = await fs.readdir(COMMENTS_DIR);
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const postSlug = file.replace('.json', '');
      const comments = await getComments(postSlug);
      
      comments.forEach(comment => {
        allComments.push({
          ...comment,
          postSlug,
        });
      });
    }
  } catch {
    // Directory might not exist
  }
  
  return allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function approveComment(postSlug, commentId) {
  const comments = await getComments(postSlug);
  const comment = comments.find(c => c.id === commentId);
  
  if (comment) {
    comment.approved = true;
    const filePath = path.join(COMMENTS_DIR, `${postSlug}.json`);
    await fs.writeFile(filePath, JSON.stringify(comments, null, 2));
  }
  
  return comment;
}

export async function deleteComment(postSlug, commentId) {
  const comments = await getComments(postSlug);
  const filtered = comments.filter(c => c.id !== commentId);
  
  const filePath = path.join(COMMENTS_DIR, `${postSlug}.json`);
  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));
}

export async function replyToComment(postSlug, commentId, reply) {
  const comments = await getComments(postSlug);
  const comment = comments.find(c => c.id === commentId);
  
  if (comment) {
    if (!comment.replies) comment.replies = [];
    
    reply.id = Date.now().toString();
    reply.createdAt = new Date().toISOString();
    reply.approved = false;
    
    comment.replies.push(reply);
    
    const filePath = path.join(COMMENTS_DIR, `${postSlug}.json`);
    await fs.writeFile(filePath, JSON.stringify(comments, null, 2));
  }
  
  return comment;
}
