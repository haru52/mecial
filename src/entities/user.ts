import { z } from "zod";
import { ScreenName } from "~/zod/zodSchemas";

export const User = z.object({
  id: z.string().uuid(),
  screenName: ScreenName.nullable(),
  name: z.string().min(1, { message: "名前を入力してください" }).nullable(),
  email: z
    .string()
    .email({ message: "メールアドレスの形式で入力してください" })
    .nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().url({ message: "URLの形式で入力してください" }).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateUser = User.omit({
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  name: true,
  email: true,
  image: true,
});

export type User = z.infer<typeof User>;
