import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { PostDetailOrEdit } from "~/app/_components/post-detail-or-edit";
import { getServerAuthSession } from "~/server/auth";

export default async function Page({
  params: { postId },
}: {
  params: { postId: string };
}) {
  const session = await getServerAuthSession();
  const post = await api.post.getFullByCreatedById(parseInt(postId, 10));
  if (post === null) notFound();
  const isAuthor = post.createdBy.userId === session?.user.id;
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <PostDetailOrEdit post={post} isAuthor={isAuthor} />
    </div>
  );
}
