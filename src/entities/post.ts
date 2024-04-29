import { number, z } from 'zod';

export const Post = z.object({
  id: z.coerce.number(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.string().uuid(),
});

export type Post = z.infer<typeof Post>;
