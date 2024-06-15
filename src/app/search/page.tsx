import { Posts } from "../_components/posts/posts";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  searchParams: { q },
}: {
  searchParams: { q?: string };
}): Promise<Metadata> => {
  const title = (() => {
    if (q === undefined) return "404 Not Found";
    const defaultTitle = "検索";
    if (q === "") return defaultTitle;
    return `${q} - ${defaultTitle}`;
  })();
  return {
    title,
  };
};

export default async function Page({
  searchParams: { q },
}: {
  searchParams: { q?: string };
}) {
  if (q === undefined) notFound();
  const session = await getServerAuthSession();
  const posts =
    session === null
      ? await api.post.search(q)
      : await api.post.searchInCurrentSocial(q);

  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <Posts posts={posts} />
    </div>
  );
}
