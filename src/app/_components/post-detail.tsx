import type { PostWithCreatedByUserAndSocial } from "~/entities/post";
import type { Dispatch, SetStateAction } from "react";
import { PostDetailOrEditFrame } from "./post-detail-or-edit-frame";

export function PostDetail({
  post,
  setIsEditing,
  isAuthor,
}: {
  post: PostWithCreatedByUserAndSocial;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  isAuthor: boolean;
}) {
  return (
    <PostDetailOrEditFrame
      post={post}
      isEditing={false}
      setIsEditing={setIsEditing}
      isAuthor={isAuthor}
    >
      <p className="my-1">{post.content}</p>
    </PostDetailOrEditFrame>
  );
}
