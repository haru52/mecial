import type { PostWithCreatedByUserAndSocial } from "~/entities/post";
import type { Dispatch, SetStateAction } from "react";
import { PostDetailOrEdit } from "./post-detail-or-edit";

export function PostDetail({
  post,
  setIsEditing,
}: {
  post: PostWithCreatedByUserAndSocial;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <PostDetailOrEdit post={post} setIsEditing={setIsEditing}>
      <p className="my-1">{post.content}</p>
    </PostDetailOrEdit>
  );
}
