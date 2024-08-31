"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";

export function PostEditAndDeleteLinks({
  postId,
  setIsEditing,
}: {
  postId: number;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });
  return (
    <div className="flex">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsEditing(true);
        }}
      >
        編集
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (!confirm("本当にこのポストを削除しますか？")) {
            return;
          }
          deletePost.mutate(postId);
        }}
        className="link ml-2"
      >
        削除
      </a>
    </div>
  );
}
