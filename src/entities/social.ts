import { z } from "zod";
import { ScreenName } from "~/zod/zodSchemas";

export const Social = z.object({
  id: z.number(),
  screenName: ScreenName,
  name: z.string(),
  image: z.string().url().nullable(),
  description: z.string().nullable(),
  url: z.string().url().nullable(),
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

export type Social = z.infer<typeof Social>;
