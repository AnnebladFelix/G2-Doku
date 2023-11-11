import {z} from 'zod';

export const getDocumentSchema = z.object({
    id: z.number(),
    title: z.string().min(1, 'Title is required.').max(255),
    content: z.string().min(1, 'Content is required.'),
    author: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string().nullable(),
      role: z.enum(['USER', 'ADMIN']),
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
    authorId: z.string(),
  });

export const getUserSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    
});

export const createDocumentSchema = z.object({
    title: z.string().min(1, 'Title is required.').max(255),
    content: z.string().min(1, 'Content is required.'),
    author: z.string(),
})

export const editDocumentSchema = z.object({
    title: z.string().min(1, 'Title is required.').max(255),
    content: z.string().min(1, 'Content is required.'),
    updatedAt: z.string(),
});