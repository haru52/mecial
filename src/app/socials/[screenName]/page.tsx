import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import type { Metadata } from "next";
import { SocialDetail } from "~/app/_components/social-detail";

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
  const session = await getServerAuthSession();
  const user =
    session === null
      ? null
      : await api.user.getByIdWithAvatars(session.user.id);
  const belongsTo = !!user?.avatars.some((a) => a.socialId === social.id);
  const posts =
    social.isPrivate && !belongsTo
      ? []
      : await api.post.getAllFullyBySocialScreenName(params.screenName);
  const avatar =
    user === null ? null : await api.avatar.getMyAvatarBySocialId(social.id);
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <SocialDetail
        social={social}
        user={user}
        avatar={avatar}
        posts={posts}
        belongsTo={belongsTo}
      />
    </div>
  );
}
