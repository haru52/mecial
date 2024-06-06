import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import type { Metadata } from "next";
import { SocialDetailOrEdit } from "~/app/_components/social-detail-or-edit";

export const generateMetadata = async ({
  params,
}: {
  params: { screenName: string };
}): Promise<Metadata> => {
  const social = await api.social.getByScreenName(params.screenName);
  return social === null ? { title: "404 Not Found" } : { title: social.name };
};

export default async function Page({
  params,
}: {
  params: { screenName: string };
}) {
  const social =
    await api.social.getByScreenNameWithAvatarUsersAndAdministrator(
      params.screenName,
    );
  if (social === null) notFound();
  const posts = await api.post.getFullAllBySocialScreenName(params.screenName);
  const session = await getServerAuthSession();
  const user =
    session === null
      ? null
      : await api.user.getByIdWithAvatars(session.user.id);
  const avatar =
    user === null ? null : await api.avatar.getMyAvatarBySocialId(social.id);
  return (
    <SocialDetailOrEdit
      social={social}
      user={user}
      avatar={avatar}
      posts={posts}
    />
  );
}
