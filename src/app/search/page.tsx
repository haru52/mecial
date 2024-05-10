import { Posts } from "../_components/posts/posts";
import { api } from "~/trpc/server";

export default async function Page({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const posts = await api.post.searchInCurrentSocial(searchParams.q);

  return <Posts posts={posts} />;
}
