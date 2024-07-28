"use client";

import { defaultSocialIconPath } from "~/consts";
import Image from "next/image";
import { useState } from "react";
import type { AvatarWithUserAndSocial } from "~/entities/avatar";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import Link from "next/link";

export function CreatePost({
  avatar,
  getPostsQueryRefetch,
}: {
  avatar: AvatarWithUserAndSocial;
  getPostsQueryRefetch: () => void;
}) {
  const [content, setContent] = useState("");
  const router = useRouter();
  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      getPostsQueryRefetch();
      setContent("");
      router.refresh();
    },
  });

  return (
    <div className="mt-5 flex items-start">
      <div className="not-prose avatar">
        <div className="w-16 rounded-full">
          <Link
            href={`/socials/${avatar.social.screenName}/${avatar.user.screenName}`}
          >
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
            disabled={createPost.isPending || content.length === 0}
            value={createPost.isPending ? "ポスト送信中…" : "ポストする"}
          ></input>
        </div>
      </form>
    </div>
  );
}
