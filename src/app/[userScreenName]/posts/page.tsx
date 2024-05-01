import { notFound } from "next/navigation";
import { Posts } from "~/app/_components/posts/posts";
import type { Post } from "~/entities/post";
import { api } from "~/trpc/server";

export default async function Page({
  params,
}: {
  params: { userScreenName: string; id: string };
}) {
  const user = await api.user.getByScreenNameWithPosts(params.userScreenName);
  if (user === null || user.posts === undefined) return notFound();
  console.dir(user.posts);
  const posts = user.posts as Post[];

  return (
    <>
      <h1>{user.name} のポスト</h1>
      <Posts user={user} posts={posts} />
    </>
  );
}
