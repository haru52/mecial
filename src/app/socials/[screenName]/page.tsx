import { api } from "~/trpc/server";
import type { Metadata } from "next";
import { JoinSocialButton } from "~/app/_components/socials/[screenName]/join-social-button";
import { LeaveSocialButton } from "~/app/_components/socials/[screenName]/leave-social-button";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";

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
  const social = await api.social.getByScreenNameWithAvatarUsers(params.screenName);
  if (social === null) notFound();
  const session = await getServerAuthSession();
  if (session === null) return notFound();
  const user = await api.user.getByIdWithAvatars(session.user.id);
  if (user === null) return notFound();
  const avatar = await api.avatar.getMyAvatarBySocialId(social.id);
  const loginUserAvatars = user.avatars;
  const avatars = social.avatars;
  return (
    <>
      <h1>{social.name}</h1>
      <ul>
        <li>{`@${social.screenName}`}</li>
        <li>{social.description}</li>
        {social.url !== null && (
          <li>
            <a href={social.url} target="_blank" rel="noreferrer">
              {social.url}
            </a>
          </li>
        )}
        <li><Link href={`/socials/${params.screenName}/avatars`}>{avatars.length} 人のアバター</Link></li>
      </ul>
      {avatar === null ? (
        <JoinSocialButton social={social} currentSocialId={user.currentSocialId} />
      ) : (
        <LeaveSocialButton avatarId={avatar.id} avatarsLength={loginUserAvatars.length} />
      )}
    </>
  );
}
