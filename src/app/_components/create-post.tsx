"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost({ avatarId }: { avatarId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setContent("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ content: content, createdById: avatarId });
      }}
      className="mt-7 w-full"
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
          className="btn btn-primary mt-5 rounded-full"
          disabled={createPost.isPending}
          value={createPost.isPending ? "ポスト送信中…" : "ポストする"}
        ></input>
      </div>
    </form>
  );
}
