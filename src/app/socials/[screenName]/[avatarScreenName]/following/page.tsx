import { api } from "~/trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Avatars } from "~/app/_components/avatars";
import { getServerAuthSession } from "~/server/auth";

export const generateMetadata = async ({
  params: { avatarScreenName, screenName },
}: {
  params: { screenName: string; avatarScreenName: string };
}): Promise<Metadata> => {
  const avatar = await api.avatar.getFullBySocialScreenNameAndUserScreenName({
    socialScreenName: screenName,
    userScreenName: avatarScreenName,
  });
  return avatar === null
    ? { title: "404 Not Found" }
    : {
        title: `${avatar.user.name}（@${avatar.user.screenName}.${avatar.social.screenName}）さんがフォローしているアバター`,
      };
};

export default async function Page({
  params: { avatarScreenName, screenName },
}: {
  params: { avatarScreenName: string; screenName: string };
}) {
  const avatar = await api.avatar.getFullBySocialScreenNameAndUserScreenName({
    socialScreenName: screenName,
    userScreenName: avatarScreenName,
  });
  if (avatar === null) notFound();
  const follows = await api.follows.getFollowingAvatarsByAvatarId(avatar.id);
  const following = follows.map((follow) => follow.following);
  const session = await getServerAuthSession();
  const loginUser =
    session === null
      ? null
      : await api.user.getByIdWithAvatars(session.user.id);
  const loginAvatar =
    loginUser === null
      ? undefined
      : loginUser.avatars.find(
          (loginAvatar) => loginAvatar.socialId === avatar.social.id,
        );
  return (
    <div className="container prose mx-auto px-4">
      <h1>
        {avatar.user.name}（{avatar.user.screenName}.{avatar.social.screenName}
        ）さんがフォロー中
      </h1>
      <Avatars avatars={following} loginAvatarId={loginAvatar?.id} />
    </div>
  );
}
