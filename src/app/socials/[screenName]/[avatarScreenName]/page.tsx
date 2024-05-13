import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FollowButton } from "~/app/_components/follow-button";
import { Posts } from "~/app/_components/posts/posts";
import { UnfollowButton } from "~/app/_components/unfollow-button";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";

export default async function Page({
  params,
}: {
  params: { screenName: string; avatarScreenName: string };
}) {
  const session = await getServerAuthSession();
  const avatar = await api.avatar.getFullBySocialScreenNameAndUserScreenName({
    socialScreenName: params.screenName,
    userScreenName: params.avatarScreenName,
  });
  if (avatar === null) notFound();
  const followingCount = await api.follows.getFollowingCountByAvatarId(avatar.id);
  const followersCount = await api.follows.getFollowersCountByAvatarId(avatar.id);
  const loginAvatar =
    session === null
      ? null
      : await api.avatar.getMyAvatarBySocialId(avatar.social.id);
  const isFollowing =
    loginAvatar === null
      ? false
      : await api.follows.isFollowing({
          followedById: loginAvatar.id,
          followingId: avatar.id,
        });

  return (
    <main className="container prose mx-auto px-4">
      <div className="not-prose avatar">
        <div className="w-24 rounded-full">
          <Image
            src={avatar.user.image ?? ""}
            width={500}
            height={500}
            alt=""
          />
        </div>
      </div>
      <h1>
        {avatar.user.name} @{" "}
        <Link
          href={`/socials/${avatar.social.screenName}`}
          className="no-underline hover:underline"
        >
          {avatar.social.name}
        </Link>
      </h1>
      <p>
        @{avatar.user.screenName}.{avatar.social.screenName}
      </p>
      {loginAvatar !== null &&
        loginAvatar.id !== avatar.id &&
        (isFollowing ? (
          <UnfollowButton avatarId={avatar.id} />
        ) : (
          <FollowButton avatarId={avatar.id} />
        ))}
      <p>{avatar.user.introduction}</p>
      {avatar.user.url !== null && avatar.user.url !== "" && (
        <p>
          <Link href={avatar.user.url} target="_blank" rel="noreferrer">
            {avatar.user.url}
          </Link>
        </p>
      )}
      <p>
      <span>{followingCount} フォロー中</span>
      <span className="ml-3">{followersCount} フォロワー</span>
      </p>
      <Posts posts={avatar.posts} />
    </main>
  );
}
