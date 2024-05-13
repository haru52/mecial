import { api } from "~/trpc/server";
import type { Metadata } from "next";
import { JoinSocialButton } from "~/app/_components/socials/[screenName]/join-social-button";
import { LeaveSocialButton } from "~/app/_components/socials/[screenName]/leave-social-button";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import { Posts } from "~/app/_components/posts/posts";

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
  const social = await api.social.getByScreenNameWithAvatarUsers(
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
    <main className="container prose mx-auto px-4">
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
        <li>
          <Link href={`/socials/${params.screenName}/avatars`}>
            {social.avatars.length} 人のアバター
          </Link>
        </li>
      </ul>
      {user !== null &&
        (avatar === null ? (
          <JoinSocialButton social={social} user={user} />
        ) : (
          <LeaveSocialButton avatarId={avatar.id} />
        ))}
      <Posts posts={posts} />
    </main>
  );
}
