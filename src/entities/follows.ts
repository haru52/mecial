import { z } from "zod";

export const Follows = z.object({
  id: z.number(),
  followedById: z.string().uuid(),
  followingId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateFollows = Follows.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateFollows = Follows.omit({
  createdAt: true,
  updatedAt: true,
}).partial({
  followedById: true,
  followingId: true,
});

export type Follows = z.infer<typeof Follows>;
