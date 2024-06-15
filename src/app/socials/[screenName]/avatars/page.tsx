import { api } from "~/trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Avatars } from "~/app/_components/avatars";
import { getServerAuthSession } from "~/server/auth";

export const generateMetadata = async ({
  params,
}: {
  params: { screenName: string };
}): Promise<Metadata> => {
  const social = await api.social.getByScreenName(params.screenName);
  return social === null
    ? { title: "404 Not Found" }
    : { title: `${social.name}のメンバー` };
};

export default async function Page({
  params,
}: {
  params: { screenName: string };
}) {
  const social = await api.social.getByScreenNameWithAvatarUsers(
    params.screenName,
  );
  if (social === null) notFound();
  const session = await getServerAuthSession();
  const loginUser =
    session === null
      ? null
      : await api.user.getByIdWithAvatars(session.user.id);
  const loginAvatar =
    loginUser === null
      ? undefined
      : loginUser.avatars.find((avatar) => avatar.socialId === social.id);
  return (
    <div className="container prose mx-auto mb-10 mt-5">
      <h1 className="text-center">{social.name}のメンバー</h1>
      <Avatars avatars={social.avatars} loginAvatarId={loginAvatar?.id} />
    </div>
  );
}
