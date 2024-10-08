"use client";

import type { PostWithCreatedByUserAndSocial } from "~/entities/post";
import type { Dispatch, SetStateAction } from "react";
import { api } from "~/trpc/react";
import { useState } from "react";
import { PostDetailOrEditFrame } from "./post-detail-or-edit-frame";
import { useRouter } from "next/navigation";

export function PostEditForm({
  post,
  setIsEditing,
}: {
  post: PostWithCreatedByUserAndSocial;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [content, setContent] = useState(post.content);
  const updatePost = api.post.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      router.refresh();
    },
  });

  return (
    <PostDetailOrEditFrame
      post={post}
      isEditing={false}
      setIsEditing={setIsEditing}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updatePost.mutate({
            id: post.id,
            content: content,
          });
        }}
      >
        <div className="form-control">
          <textarea
            name="content"
            className="textarea textarea-bordered"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="my-5 flex space-x-4">
          <input
            type="submit"
            value={updatePost.isPending ? "保存中…" : "保存"}
            className="btn btn-primary flex-1 rounded-full"
            disabled={
              updatePost.isPending ||
              content === post.content ||
              content.trim().length === 0
            }
          />
          <button
            type="button"
            className="btn btn-neutral flex-1 rounded-full"
            onClick={() => setIsEditing(false)}
          >
            キャンセル
          </button>
        </div>
      </form>
    </PostDetailOrEditFrame>
  );
}
