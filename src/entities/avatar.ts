import { z } from "zod";
import { User } from "./user";

export const Avatar = z.object({
  id: z.number(),
  isPrivate: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().uuid(),
  socialId: z.number(),
});

export const CreateAvatar = Avatar.omit({
  id: true,
  isPrivate: true,
  createdAt: true,
  updatedAt: true,
});

export type Avatar = z.infer<typeof Avatar>;

export type AvatarWithUser = Avatar & {
  user: User;
};