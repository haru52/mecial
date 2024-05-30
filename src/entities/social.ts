import { z } from "zod";
import { IconImage, ScreenName, Url } from "~/zod/zod-schemas";

export const Social = z.object({
  id: z.number(),
  screenName: ScreenName,
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
  name: true,
  image: true,
  description: true,
  url: true,
  administratorId: true,
});

export type Social = z.infer<typeof Social>;
