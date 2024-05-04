import { z } from "zod";

export const Social = z.object({
  id: z.number(),
  screenName: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  url: z.string().url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Social = z.infer<typeof Social>;
