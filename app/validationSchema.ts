import {z} from 'zod';

export const getDocumentSchema = z.object({
    id: z.number(),
    title: z.string().min(1, 'Title is required.').max(255),
    content: z.string().min(1, 'Content is required.'),
});

export const createDocumentSchema = z.object({
    title: z.string().min(1, 'Title is required.').max(255),
    content: z.string().min(1, 'Content is required.')
})