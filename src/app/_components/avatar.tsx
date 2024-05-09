import type { AvatarWithUser } from "~/entities/avatar";
import { defaultIconPath } from "~/consts";
import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "./follow-button";
import { UnfollowButton } from "./unfollow-button";
import { api } from "~/trpc/server";

export async function Avatar({
  avatar,
  loginAvatarId,
}: {
  avatar: AvatarWithUser;
  loginAvatarId?: string;
}) {
  const loginAvatarIsInSocial = loginAvatarId !== undefined;
  const isFollowing = loginAvatarIsInSocial
    ? await api.follows.isFollowing({
        followedById: loginAvatarId,
        followingId: avatar.id,
      })
    : false;
  return (
    <Link
      href={`/socials/main/${avatar.user.screenName}`}
      className="no-underline inline-block"
    >
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="card-title">
            <div className="not-prose avatar">
              <div className="w-11 rounded-full">
                <Image
                  src={avatar.user.image ?? defaultIconPath}
                  width={500}
                  height={500}
                  alt=""
                />
              </div>
            </div>
            <div>
              <h2 className="my-0">{`${avatar.user.name}`}</h2>
              <span>@{avatar.user.screenName}</span>
            </div>
          </div>
          <p>アバターの自己紹介文。</p>
          <div className="card-actions justify-end">
            {loginAvatarIsInSocial && loginAvatarId !== avatar.id && 
              (isFollowing ? (
                <UnfollowButton avatarId={avatar.id} />
              ) : (
                <FollowButton avatarId={avatar.id} />
              ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
