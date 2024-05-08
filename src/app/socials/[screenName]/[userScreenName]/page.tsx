import { api } from "~/trpc/server";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FollowButton } from "~/app/_components/follow-button";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { DEFAULT_ICON_PATH } from "~/consts";

function getSocial(socialScreenName: string) {
  return api.social.getByScreenName(socialScreenName);
}

async function getAvatarWithUser(socialId: number, userScreenName: string) {
  const user = await api.user.getByScreenName(userScreenName);
  if (user === null) return null;
  return api.avatar.getBySocialIdAndUserIdWithUser({
    socialId,
    userId: user.id,
  });
}

export const generateMetadata = async ({
  params,
}: {
  params: { screenName: string; userScreenName: string };
}): Promise<Metadata> => {
  const social = await getSocial(params.screenName);
  if (social === null) return { title: "404 Not Found" };

  const avatar = await getAvatarWithUser(social.id, params.userScreenName);
  if (avatar === null) return { title: "404 Not Found" };
  return {
    title: `${avatar.user.name}`,
    description: avatar.user.name,
  };
};

export default async function Page({
  params,
}: {
  params: { userScreenName: string; screenName: string };
}) {
  const session = await getServerAuthSession();
  if (session === null) redirect("/");
  const social = await getSocial(params.screenName);
  if (social === null) return redirect("/");
  const loginAvatar = await api.avatar.getBySocialIdAndUserIdWithUser({
    socialId: social.id,
    userId: session.user.id,
  });
  if (loginAvatar === null) return redirect("/");

  const avatar = await getAvatarWithUser(social.id, params.userScreenName);
  if (avatar === null) notFound();
  return (
    <>
      <h1>{avatar.user.name}</h1>
      <p>{avatar.user.screenName}</p>
      <Image
        src={avatar.user.image ?? DEFAULT_ICON_PATH}
        width={100}
        height={100}
        alt={avatar.user.name ?? ""}
      />
      {loginAvatar.user.currentSocialId === social.id && loginAvatar.id !== avatar.id && (
        <FollowButton avatarId={avatar.id} />
      )}
    </>
  );
}
