"use client";

import Image from "next/image";
import Link from "next/link";
import { defaultUserAndAvatarIconPath } from "~/consts";
import type { PostWithCreatedByUserAndSocial } from "~/entities/post";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

dayjs.extend(relativeTime);
dayjs.locale("ja");

export function Post({ post }: { post: PostWithCreatedByUserAndSocial }) {
  const avatarPath = `/socials/${post.createdBy.social.screenName}/${post.createdBy.user.screenName}`;
  const router = useRouter();

  return (
    <div
      className="card w-full cursor-pointer bg-base-100 shadow-xl"
      onClick={(e) => {
        e.preventDefault();
        router.push(
          `/socials/${post.createdBy.social.screenName}/${post.createdBy.user.screenName}/posts/${post.id}`,
        );
      }}
    >
      <div className="card-body">
        <div className="card-title">
          <Link
            href={avatarPath}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
          <Link
            href={avatarPath}
            className="inline-flex items-center gap-1 no-underline hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="my-0 text-sm">{post.createdBy.user.name}</h2>
            {post.createdBy.social.isPrivate && (
              <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
            )}
          </Link>
          <Link
            href={avatarPath}
            className="no-underline hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="block text-sm">
              @{post.createdBy.user.screenName}.
              {post.createdBy.social.screenName}
            </span>
          </Link>
        </div>
        <p className="my-1">{post.content}</p>
        <span className="text-xs">{dayjs(post.createdAt).fromNow()}</span>
      </div>
    </div>
  );
}
