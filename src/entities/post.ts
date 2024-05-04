import { z } from "zod";
import { User, Foo } from "./user";

export const Post = z.object({
  id: z.coerce.number(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.string().uuid().optional(),
});

export const CreatePost = Post.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePost = Post.omit({
  createdAt: true,
  updatedAt: true,
});

export type Post = z.infer<typeof Post>;
