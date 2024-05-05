import { api } from "~/trpc/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { JoinSocialButton } from "~/app/_components/socials/[screenName]/join-social-button";
import { LeaveSocialButton } from "~/app/_components/socials/[screenName]/leave-social-button";
import { notFound } from "next/navigation";

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
  const social = await api.social.getByScreenName(params.screenName);
  if (social === null) notFound();
  const avatar = await api.avatar.getMyAvatarBySocialId(social.id);
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
      </ul>
      {avatar === null ? (
        <JoinSocialButton social={social} />
      ) : (
        <LeaveSocialButton avatarId={avatar.id} />
      )}
    </>
  );
}
