import { z } from "zod";
import { ScreenName, Url } from "~/zod/zodSchemas";

export const Social = z.object({
  id: z.number(),
  screenName: ScreenName,
  name: z.string().min(1),
  image: Url.nullable(),
  description: z.string().nullable(),
  url: Url.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateSocial = Social.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  image: true,
  description: true,
  url: true,
});

export const UpdateSocial = Social.omit({
  createdAt: true,
  updatedAt: true,
}).partial({
  screenName: true,
  name: true,
  image: true,
  description: true,
  url: true,
});

export type Social = z.infer<typeof Social>;
