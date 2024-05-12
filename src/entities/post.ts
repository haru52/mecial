import { z } from "zod";
import type { AvatarWithUser } from "./avatar";

export const Post = z.object({
  id: z.number(),
  content: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.string().uuid(),
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

export type PostWithCreatedByUserAndSocial = Post & {
  createdBy: AvatarWithUser;
};
