import { z } from "zod";
import { Post } from "./post";

export const User = z.object({
  id: z.string().uuid(),
  screenName: z
    .string()
    .min(1, {
      message: "IDを入力してください",
    })
    .nullable(),
  name: z
    .string()
    .min(1, {
      message: "名前を入力してください",
    })
    .nullable(),
  email: z
    .string()
    .email({
      message: "メールアドレスの形式が正しくありません",
    })
    .nullable(),
  emailVerified: z.date().nullable(),
  image: z
    .string()
    .url({
      message: "画像URLの形式が正しくありません",
    })
    .nullable(),
  posts: z.array(Post).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateUser = User.required({
  screenName: true,
  name: true,
  email: true,
}).omit({
  id: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
});

export type User = z.infer<typeof User>;
