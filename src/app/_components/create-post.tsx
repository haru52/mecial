"use client";

import { defaultSocialIconPath } from "~/consts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AvatarWithUser } from "~/entities/avatar";

import { api } from "~/trpc/react";
import Link from "next/link";

export function CreatePost({ avatar }: { avatar: AvatarWithUser }) {
  const router = useRouter();
  const [content, setContent] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setContent("");
    },
  });

  return (
    <div className="mt-5 flex items-start">
      <div className="not-prose avatar">
        <div className="w-16 rounded-full">
          <Link href={`/${avatar.user.screenName}`}>
            <Image
              src={avatar.user.image ?? defaultSocialIconPath}
              width={500}
              height={500}
              alt=""
            />
          </Link>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ content: content, createdById: avatar.id });
        }}
        className="ml-6 grow"
      >
        <textarea
          placeholder="いまどうしてる？"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea textarea-bordered w-full"
          required
        ></textarea>
        <div className="flex flex-row-reverse">
          <input
            type="submit"
            className="btn btn-primary mt-2 rounded-full"
            disabled={createPost.isPending}
            value={createPost.isPending ? "ポスト送信中…" : "ポストする"}
          ></input>
        </div>
      </form>
    </div>
  );
}
