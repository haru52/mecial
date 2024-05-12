import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FollowButton } from "~/app/_components/follow-button";
import { UnfollowButton } from "~/app/_components/unfollow-button";
import { api } from "~/trpc/server";

export default async function Page({
  params,
}: {
  params: { screenName: string; avatarScreenName: string };
}) {
  const avatar = await api.avatar.getFullBySocialScreenNameAndUserScreenName({
    socialScreenName: params.screenName,
    userScreenName: params.avatarScreenName,
  });
  if (avatar === null) notFound();
  const loginAvatar = await api.avatar.getMyAvatarBySocialId(avatar.social.id);
  if (loginAvatar === null) throw new Error("Avatar not found");
  const isFollowing = await api.follows.isFollowing({
    followedById: loginAvatar.id,
    followingId: avatar.id,
  });

  return (
    <>
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
      <h1>{avatar.user.name}</h1>
      <p>@{avatar.user.screenName}</p>
      {loginAvatar.id !== avatar.id &&
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
    </>
  );
}
