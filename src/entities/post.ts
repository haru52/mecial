import { z } from "zod";
import { User } from "./user";

export const Post = z.object({
  id: z.coerce.number(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // createdBy: z.object(User).optional(),
  createdById: z.string().uuid().optional(),
});

export const CreatePost = Post.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePost = Post.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Post = z.infer<typeof Post>;
