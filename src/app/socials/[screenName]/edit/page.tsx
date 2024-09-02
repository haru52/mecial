import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SocialEdit } from "~/app/_components/social-edit";

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
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <SocialEdit social={social} />
    </div>
  );
}
