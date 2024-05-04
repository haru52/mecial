import { api } from "~/trpc/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: { screenName: string };
}): Promise<Metadata> => {
  const social = await api.social.getByScreenName(params.screenName);

  return {
    title: social?.name ?? "ソーシャル",
  };
};

export default async function Page({
  params,
}: {
  params: { screenName: string };
}) {
  const social = await api.social.getByScreenName(params.screenName);
  if (social === null) {
    redirect("/");
  }
  return (
    <>
      <h1>{social.name}</h1>
      <ul>
        <li>{`@${social.screenName}`}</li>
        <li>{social.description}</li>
        {social.url !== null && (
          <li>
            <a href={social.url} target="_blank" rel="noreferrer">{social.url}</a>
          </li>
        )}
      </ul>
    </>
  );
}
