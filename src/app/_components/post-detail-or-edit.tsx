"use client";

import { notFound } from "next/navigation";
import { PostEditForm } from "~/app/_components/post-edit-form";
import { PostDetail } from "~/app/_components/post-detail";
import { useState } from "react";
import type { PostWithCreatedByUserAndSocial } from "~/entities/post";

export function PostDetailOrEdit({
  post,
  isAuthor,
}: {
  post: PostWithCreatedByUserAndSocial;
  isAuthor: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  if (post === null) notFound();
  if (post !== undefined) {
    return isEditing ? (
      <PostEditForm post={post} setIsEditing={setIsEditing} />
    ) : (
      <>
        <PostDetail
          post={post}
          setIsEditing={setIsEditing}
          isAuthor={isAuthor}
        />
      </>
    );
  }
  return <div>Post not found</div>;
}
