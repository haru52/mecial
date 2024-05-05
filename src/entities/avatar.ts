import { z } from "zod";

export const Avatar = z.object({
  id: z.number(),
  isPrivate: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  socialId: z.number(),
});

export const CreateAvatar = Avatar.omit({
  id: true,
  isPrivate: true,
  createdAt: true,
  updatedAt: true,
});
