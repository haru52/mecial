import { z } from "zod";

export const ScreenName = z
  .string({ invalid_type_error: "文字列を入力してください" })
  .min(1, { message: "IDを入力してください" })
  .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
    message:
      "半角英数字とアンダースコア（_）のみ使用できます。また、先頭は半角英字にする必要があります",
  });
