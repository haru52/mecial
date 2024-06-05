import Link from "next/link";
import { PostEditAndDeleteLinks } from "~/app/_components/post-edit-and-delete-links";
import Image from "next/image";
import type { PostWithCreatedByUserAndSocial } from "~/entities/post";
import { defaultUserAndAvatarIconPath } from "~/consts";
import type { Dispatch, SetStateAction } from "react";

export function PostDetailOrEdit({
  post,
  setIsEditing,
  children,
}: {
  post: PostWithCreatedByUserAndSocial;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  const avatarPath = `/socials/${post.createdBy.social.screenName}/${post.createdBy.user.screenName}`;

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="card-title">
          <Link href={avatarPath}>
            <div className="not-prose avatar">
              <div className="w-11 rounded-full">
                <Image
                  src={
                    post.createdBy.user.image ?? defaultUserAndAvatarIconPath
                  }
                  width={500}
                  height={500}
                  alt={post.createdBy.user.name ?? "ユーザーアイコン"}
                />
              </div>
            </div>
          </Link>
          <Link href={avatarPath} className="no-underline hover:underline">
            <h2 className="my-0 text-sm">{post.createdBy.user.name}</h2>
          </Link>
          <Link href={avatarPath} className="no-underline hover:underline">
            <span className="block text-sm">
              @{post.createdBy.user.screenName}.
              {post.createdBy.social.screenName}
            </span>
          </Link>
        </div>
        {children}
        <span className="text-xs">
          作成：{post.createdAt.toLocaleString("ja-JP")}
        </span>
        <span className="text-xs">
          更新：{post.updatedAt.toLocaleString("ja-JP")}
        </span>
        <PostEditAndDeleteLinks postId={post.id} setIsEditing={setIsEditing} />
      </div>
    </div>
  );
}
