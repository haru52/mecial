import { z } from "zod";
import type { Social } from "./social";
import type { User } from "./user";

export const Avatar = z.object({
  id: z.string().uuid(),
  isPrivate: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().uuid(),
  socialId: z.number(),
});

export const CreateAvatar = Avatar.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
}).partial({
  isPrivate: true,
});

export type Avatar = z.infer<typeof Avatar>;

export type AvatarWithUser = Avatar & {
  user: User;
};

export type AvatarWithUserAndSocial = AvatarWithUser & {
  social: Social;
};
