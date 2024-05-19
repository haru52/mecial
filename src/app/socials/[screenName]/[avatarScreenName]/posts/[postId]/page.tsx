"use client";

import { api } from "~/trpc/react";
import { notFound } from "next/navigation";
import { PostEditForm } from "~/app/_components/post-edit-form";
import { PostDetail } from "~/app/_components/post-detail";
import { useState } from "react";

export default function Page({
  params: { postId },
}: {
  params: { postId: string };
}) {
  const getPost = api.post.getFullByCreatedById.useQuery(parseInt(postId, 10));
  const post = getPost.data;
  const [isEditing, setIsEditing] = useState(false);
  if (getPost.error) return <div>{getPost.error.message}</div>;
  if (getPost.isLoading) return <div>Loading...</div>;
  if (post === null) notFound();
  if (post !== undefined) {
    return (
      <main className="container prose mx-auto px-4 pt-5">
        {isEditing ? (
          <PostEditForm
            post={post}
            refetchPost={getPost.refetch}
            setIsEditing={setIsEditing}
          />
        ) : (
          <>
            <PostDetail post={post} setIsEditing={setIsEditing} />
          </>
        )}
      </main>
    );
  }
  return <div>Post not found</div>;
}
