import type { Metadata } from "next";
import Link from "next/link";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Image from "next/image";

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

  if (user === null) return notFound();
  return (
    <main className="container prose mx-auto px-4">
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
    </main>
  );
}
