import { z } from "zod";
import { User, Foo } from "./user";

export const Post = z.object({
  id: z.coerce.number(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.string().uuid().optional(),
});

export const UserSchema = z.object({
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
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreatePost = Post.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePost = Post.omit({
  createdAt: true,
  updatedAt: true,
});

export type Post = z.infer<typeof Post>;
