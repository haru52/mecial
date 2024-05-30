import { z } from "zod";

export const ZodString = z.string({
  invalid_type_error: "文字列を入力してください",
});

export const ScreenName = ZodString.min(1, {
  message: "IDを入力してください",
}).regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
  message:
    "半角英数字とアンダースコア（_）のみ使用できます。また、先頭は半角英字にする必要があります",
});

export const Url = ZodString.url({ message: "URLの形式で入力してください" });

export const IconImage = Url.regex(
  /^https:\/\/(lh3\.googleusercontent\.com\/.+|cdn\.discordapp\.com\/avatars\/.+|(secure\.)?gravatar\.com\/avatar\/[0-9a-fA-f]{32}|i\.imgur\.com\/.+).+/,
  {
    message:
      "以下のいずれかのサービスの画像URLを入力してください：Googleアカウント、Discordアカウント、Gravatar、Imgur",
  },
);
