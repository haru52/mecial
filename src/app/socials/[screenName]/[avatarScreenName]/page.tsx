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
  const followingCount = await api.follows.getFollowingCountByAvatarId(
    avatar.id,
  );
  const followersCount = await api.follows.getFollowersCountByAvatarId(
    avatar.id,
  );
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
  const posts = avatar.posts.reverse();

  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <div className="flex items-end">
        <div className="not-prose avatar mr-auto">
          <div className="w-24 rounded-full">
            <Image
              src={avatar.user.image ?? ""}
              width={500}
              height={500}
              alt=""
            />
          </div>
        </div>
        {loginAvatar !== null &&
          loginAvatar.id !== avatar.id &&
          (isFollowing ? (
            <UnfollowButton
              followedById={loginAvatar.id}
              followingId={avatar.id}
              followingAvatarScreenName={avatar.user.screenName}
            />
          ) : (
            <FollowButton
              followedById={loginAvatar.id}
              followingId={avatar.id}
            />
          ))}
      </div>
      <h1 className="mb-0">
        {avatar.user.name} @{" "}
        <Link
          href={`/socials/${avatar.social.screenName}`}
          className="no-underline hover:underline"
        >
          {avatar.social.name}
        </Link>
      </h1>
      <p className="mt-0">
        @{avatar.user.screenName}.{avatar.social.screenName}
      </p>
      <p>{avatar.user.introduction}</p>
      {avatar.user.url !== null && avatar.user.url !== "" && (
        <p>
          <Link
            href={avatar.user.url}
            target="_blank"
            rel="noreferrer"
            className="link link-primary no-underline hover:underline"
          >
            {avatar.user.url}
          </Link>
        </p>
      )}
      <p>{`${avatar.createdAt.getFullYear()}年${avatar.createdAt.getMonth()}月に参加しました`}</p>
      <p>
        <Link
          href={`${avatar.user.screenName}/following`}
          className="no-underline hover:underline"
        >
          {followingCount} フォロー中
        </Link>
        <Link
          href={`${avatar.user.screenName}/followers`}
          className="ml-3 no-underline hover:underline"
        >
          {followersCount} フォロワー
        </Link>
      </p>
      <Posts posts={posts} />
    </div>
  );
}
