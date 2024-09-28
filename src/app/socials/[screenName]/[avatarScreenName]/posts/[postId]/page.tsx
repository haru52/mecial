import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { PostDetailOrEdit } from "~/app/_components/post-detail-or-edit";
import { getServerAuthSession } from "~/server/auth";
import type { Metadata } from "next";
import { notFoundMessage } from "~/consts";

export const generateMetadata = async ({
  params,
}: {
  params: { postId: string };
}): Promise<Metadata> => {
  const post = await api.post.getFullyById(parseInt(params.postId, 10));
  if (post === null) return { title: notFoundMessage };

  return {
    title: `Mecialユーザーの${post.createdBy.user.name}さん: 「${post.content}」`,
  };
};

export default async function Page({
  params: { postId },
}: {
  params: { postId: string };
}) {
  const session = await getServerAuthSession();
  const post = await api.post.getFullyById(parseInt(postId, 10));
  if (post === null) notFound();
  const isAuthor = post.createdBy.userId === session?.user.id;
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <PostDetailOrEdit post={post} isAuthor={isAuthor} />
    </div>
  );
}
