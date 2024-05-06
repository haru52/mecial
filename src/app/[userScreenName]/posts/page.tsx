import { notFound } from "next/navigation";
import { Posts } from "~/app/_components/posts/posts";
import type { Post } from "~/entities/post";
import { api } from "~/trpc/server";

export default async function Page() {
  const user = await api.user.getMe();
  const avatar = user?.currentSocialId == null ? null : await api.avatar.getMyAvatarBySocialIdWithPosts(user?.currentSocialId);
  if (user === null || avatar?.posts === undefined) return notFound();
  const posts = avatar.posts as Post[];

  return (
    <>
      <h1>{user.name} のポスト</h1>
      <Posts user={user} posts={posts} />
    </>
  );
}
