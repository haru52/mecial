import Image from "next/image";
import Link from "next/link";
import { defaultUserIconPath } from "~/consts";
import type { PostWithCreatedByUserAndSocial } from "~/entities/post";

export async function Post({ post }: { post: PostWithCreatedByUserAndSocial }) {
  const avatarPath = `/socials/${post.createdBy.social.screenName}/${post.createdBy.user.screenName}`;

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="card-title">
          <Link href={avatarPath}>
            <div className="not-prose avatar">
              <div className="w-11 rounded-full">
                <Image
                  src={post.createdBy.user.image ?? defaultUserIconPath}
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
            <span className="text-sm block">@{post.createdBy.user.screenName}.{post.createdBy.social.screenName}</span>
          </Link>
        </div>
        <p className="my-1">{post.content}</p>
        <span className="text-xs">
          {post.createdAt.toLocaleString("ja-JP")}
        </span>
      </div>
    </div>
  );
}
