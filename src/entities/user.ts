import { z } from "zod";
import { IconImage, ScreenName, Url, ZodString } from "~/zod/zod-schemas";

export const User = z.object({
  id: ZodString.uuid(),
  screenName: ScreenName.nullable(),
  name: ZodString.min(1, { message: "名前を入力してください" }).nullable(),
  email: ZodString.email({
    message: "メールアドレスの形式で入力してください",
  }).nullable(),
  image: IconImage.nullable(),
  introduction: ZodString.nullable(),
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
  introduction: true,
  url: true,
  currentSocialId: true,
});

export type User = z.infer<typeof User>;
