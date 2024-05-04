import { z } from "zod";

export const User = z.object({
  id: z.string().uuid(),
  screenName: z
    .string({ invalid_type_error: "文字列を入力してください" })
    .min(1, { message: "IDを入力してください" })
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
      message:
        "半角英数字とアンダースコア（_）のみ使用できます。また、先頭は半角英字にする必要があります",
    })
    .nullable(),
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
