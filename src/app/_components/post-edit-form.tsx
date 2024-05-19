"use client";

import type { PostWithCreatedByUserAndSocial } from "~/entities/post";
import type { Dispatch, SetStateAction } from "react";
import { api } from "~/trpc/react";
import { useState } from "react";
import { PostDetailOrEdit } from "./post-detail-or-edit";

export function PostEditForm({
  post,
  setIsEditing,
  refetchPost,
}: {
  post: PostWithCreatedByUserAndSocial;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  refetchPost: () => void;
}) {
  const [content, setContent] = useState(post.content);
  const updatePost = api.post.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      refetchPost();
    },
  });

  return (
    <PostDetailOrEdit post={post} setIsEditing={setIsEditing}>
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
            id="content"
            name="content"
            className="textarea textarea-bordered"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="form-control mt-5">
          <input type="submit" value="保存" className="btn btn-primary" />
          <button
            type="button"
            className="btn btn-neutral"
            onClick={() => setIsEditing(false)}
          >
            キャンセル
          </button>
        </div>
      </form>
    </PostDetailOrEdit>
  );
}
