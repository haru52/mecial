import { z } from 'zod';

export const User = z.object({
  id: z.string().uuid(),
  screenName: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.date(),
  image: z.string().url(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).partial({
  emailVerified: true,
  image: true,
  createdAt: true,
  updatedAt: true,
});

export type User = z.infer<typeof User>;
