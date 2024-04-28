import type { Metadata } from "next";
import { api } from "~/trpc/server";
import { notFound } from 'next/navigation';

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

  if (user === null) return notFound();

  return (
    <>
      <h1>{user?.name}</h1>
      <ul>
        <li>ID：@{user?.screenName}</li>
        <li>メールアドレス：{user?.email}</li>
      </ul>
    </>
  );
}
