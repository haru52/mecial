import { z } from "zod";
import { Post } from "./post";

export const User = z
  .object({
    id: z.string().uuid(),
    screenName: z.string(),
    name: z.string().min(1, {
      message: "名前を入力してください",
    }),
    email: z.string().email({
      message: "メールアドレスの形式が正しくありません",
    }),
    emailVerified: z.date(),
    image: z.string().url(),
    posts: z.array(Post),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .partial({
    id: true,
    screenName: true,
    name: true,
    email: true,
    emailVerified: true,
    image: true,
    posts: true,
    createdAt: true,
    updatedAt: true,
  });

export type User = z.infer<typeof User>;
