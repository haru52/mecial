import { api } from "~/trpc/server";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Avatars } from "~/app/_components/avatars";
import { getServerAuthSession } from "~/server/auth";
import { loginPath } from "~/consts";
import Link from "next/link";

export const generateMetadata = async ({
  params,
}: {
  params: { screenName: string };
}): Promise<Metadata> => {
  const social = await api.social.getByScreenName(params.screenName);
  return social === null ? { title: "404 Not Found" } : { title: `${social.name}のアバター` };
};

export default async function Page({
  params,
}: {
  params: { screenName: string };
}) {
  const social = await api.social.getByScreenNameWithAvatarUsers(params.screenName);
  if (social === null) notFound();
  const session = await getServerAuthSession();
  if (session === null) redirect(loginPath);
  const loginUser = await api.user.getByIdWithAvatars(session.user.id);
  if (loginUser === null) redirect(loginPath);
  const loginAvatar = loginUser.avatars.find((avatar) => avatar.socialId === social.id);
  const avatars = social.avatars;
  return (
    <>
      <h1>{social.name}のアバター</h1>
      <Avatars avatars={avatars} loginAvatarId={loginAvatar?.id} />
    </>
  );
}
