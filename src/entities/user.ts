import { z } from "zod";
import { ScreenName, Url } from "~/zod/zodSchemas";

export const User = z.object({
  id: z.string().uuid(),
  screenName: ScreenName.nullable(),
  name: z.string().min(1, { message: "名前を入力してください" }).nullable(),
  email: z
    .string()
    .email({ message: "メールアドレスの形式で入力してください" })
    .nullable(),
  image: Url.nullable(),
  url: Url.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  currentSocialId: z.number().nullable(),
});

export const UpdateUser = User.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  screenName: true,
  name: true,
  email: true,
  image: true,
  url: true,
  currentSocialId: true,
});

export type User = z.infer<typeof User>;
