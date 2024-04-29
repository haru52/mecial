import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import type { Post } from "~/entities/post";

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
      {posts.length > 1 ? (
        <ul>
          <>
            {posts.map((post) => (
              <li key={post.id}>
                <p>{post.content}</p>
              </li>
            ))}
          </>
        </ul>
      ) : (
        <p>まだポストがありません</p>
      )}
    </>
  );
}
