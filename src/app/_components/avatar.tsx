import type { AvatarWithUserAndSocial } from "~/entities/avatar";
import { defaultUserAndAvatarIconPath } from "~/consts";
import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "./follow-button";
import { UnfollowButton } from "./unfollow-button";
import { api } from "~/trpc/server";

export async function Avatar({
  avatar,
  loginAvatarId,
}: {
  avatar: AvatarWithUserAndSocial;
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
      href={`/socials/${avatar.social.screenName}/${avatar.user.screenName}`}
      className="mx-auto block w-full no-underline"
    >
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="card-title">
            <div className="not-prose avatar">
              <div className="w-11 rounded-full">
                <Image
                  src={avatar.user.image ?? defaultUserAndAvatarIconPath}
                  width={500}
                  height={500}
                  alt=""
                />
              </div>
            </div>
            <div>
              <h2 className="card-title my-0">{avatar.user.name}</h2>
              <p className="my-0 text-sm">
                @{avatar.user.screenName}.{avatar.social.screenName}
              </p>
            </div>
          </div>
          <p>{avatar.user.introduction ?? ""}</p>
          <div className="card-actions justify-end">
            {loginAvatarIsInSocial &&
              loginAvatarId !== avatar.id &&
              (isFollowing ? (
                <UnfollowButton
                  followedById={loginAvatarId}
                  followingId={avatar.id}
                />
              ) : (
                <FollowButton
                  followedById={loginAvatarId}
                  followingId={avatar.id}
                />
              ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
