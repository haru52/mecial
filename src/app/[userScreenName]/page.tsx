import type { Metadata } from "next";
import Link from "next/link";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { SelectSocial } from "../_components/[userScreenName]/select-social";

export const generateMetadata = async ({
  params,
}: {
  params: { userScreenName: string };
}): Promise<Metadata> => {
  const user = await api.user.getByScreenName(params.userScreenName);

  return {
    title: user?.name ?? "User",
  };
};

export default async function Page({
  params,
}: {
  params: { userScreenName: string };
}) {
  const user = await api.user.getByScreenName(params.userScreenName);
  const session = await getServerAuthSession();
  const avatar = await api.avatar.getCurrentMyAvatar();
  const avatarsWithSocial = await api.avatar.getMyAvatarsWithSocial();
  const socials = avatarsWithSocial.map((avatar) => avatar.social);

  if (user === null) return notFound();

  return (
    <>
      <h1>{user?.name}</h1>
      <ul>
        <li>ID：@{user?.screenName}</li>
      </ul>
      {session?.user.id === user.id && (
        <>
          <Link href={`${user.screenName}/edit`}>Edit</Link>
          <br />
        </>
      )}
      <Link href={`${user.screenName}/posts`}>Posts</Link>
      {avatar !== null && (
        <>
      <CreatePost avatarId={avatar.id} />
      <SelectSocial socials={socials} currentSocialId={user.currentSocialId} />
      </>
    )}
    </>
  );
}
