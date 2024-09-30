import { z } from "zod";
import { imageUrlRuleMessage, screenNameRule } from "~/consts";

export const ZodString = z.string({
  invalid_type_error: "文字列を入力してください",
});

export const ScreenName = ZodString.min(1, {
  message: "IDを入力してください",
}).regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
  message: screenNameRule,
});

export const Url = ZodString.url({ message: "URLの形式で入力してください" });

export const IconImage = Url.regex(
  /^https:\/\/(lh3\.googleusercontent\.com\/.+|cdn\.discordapp\.com\/avatars\/.+|(secure\.)?gravatar\.com\/avatar\/[0-9a-fA-f]{32}|i\.ibb\.co\/.+|i\.postimg\.cc\/.+).+/,
  {
    message: imageUrlRuleMessage,
  },
);
