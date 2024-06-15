"use client";

import Link from "next/link";
import { JoinSocialButton } from "./socials/[screenName]/join-social-button";
import { LeaveSocialButton } from "./socials/[screenName]/leave-social-button";
import { Posts } from "./posts/posts";
import type { SocialWithAvatarUsersAndAdministrator } from "~/entities/social";
import type { User } from "~/entities/user";
import type { PostWithCreatedByUserAndSocial } from "~/entities/post";
import type { Avatar } from "~/entities/avatar";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { defaultSocialIconPath } from "~/consts";

export function SocialDetail({
  social,
  user,
  avatar,
  posts,
  setIsEditing,
}: {
  social: SocialWithAvatarUsersAndAdministrator;
  user: User | null;
  avatar: Avatar | null;
  posts: PostWithCreatedByUserAndSocial[];
  setIsEditing: (isEditing: boolean) => void;
}) {
  const router = useRouter();
  const deleteSocial = api.social.delete.useMutation({
    onSuccess: () => {
      router.push("/socials");
      router.refresh();
    },
  });

  return (
    <>
      <div className="not-prose avatar">
        <div className="w-24 rounded-full">
          <Image
            src={social.image ?? defaultSocialIconPath}
            width={500}
            height={500}
            alt=""
          />
        </div>
      </div>
      <h1>{social.name}</h1>
      <p>@{social.screenName}</p>
      {user !== null &&
        (avatar === null ? (
          <div className="mt-5">
            <JoinSocialButton social={social} />
          </div>
        ) : (
          <div className="mt-5">
            <LeaveSocialButton avatarId={avatar.id} />
          </div>
        ))}
      <p>{social.description}</p>
      {social.url && (
        <p>
          <Link
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="link-hover link link-primary"
          >
            {decodeURI(social.url)}
          </Link>
        </p>
      )}
      <p>
        {" "}
        <Link href={`/socials/${social.screenName}/avatars`}>
          {social.avatars.length} 人のメンバー
        </Link>
      </p>
      {social.administratorId === user?.id && (
        <div>
          <span
            className="link"
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(true);
            }}
          >
            編集
          </span>
          <span
            className="link ml-3"
            onClick={(e) => {
              e.preventDefault();
              confirm("本当に削除しますか？") && deleteSocial.mutate(social.id);
            }}
          >
            削除
          </span>
        </div>
      )}
      <Posts posts={posts} />
    </>
  );
}
