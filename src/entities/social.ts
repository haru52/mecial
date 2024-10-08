import { z } from "zod";
import { IconImage, ScreenName, Url } from "~/zod/zod-schemas";
import { type User } from "./user";
import { type AvatarWithUser } from "./avatar";

export const Social = z.object({
  id: z.number(),
  screenName: ScreenName,
  isPrivate: z.boolean(),
  name: z.string().min(1),
  image: IconImage.nullable(),
  description: z.string().nullable(),
  url: Url.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.string().uuid().nullable(),
  administratorId: z.string().uuid(),
});

export const CreateSocial = Social.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
  administratorId: true,
}).partial({
  image: true,
  description: true,
  url: true,
});

export const UpdateSocial = Social.omit({
  createdAt: true,
  updatedAt: true,
  createdById: true,
}).partial({
  screenName: true,
  isPrivate: true,
  name: true,
  image: true,
  description: true,
  url: true,
  administratorId: true,
});

export type Social = z.infer<typeof Social>;

export type SocialWithAvatarUsersAndAdministrator = Social & {
  avatars: AvatarWithUser[];
  administrator: User;
};
