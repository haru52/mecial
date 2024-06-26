import { api } from "~/trpc/server";
import { loginPath } from "~/consts";
import { notFound, redirect } from "next/navigation";
import { EditForm } from "~/app/_components/[userScreenName]/edit-form";
import { getServerAuthSession } from "~/server/auth";
import { DeleteUserLink } from "~/app/_components/delete-user-link";
import type { Metadata } from "next";

const title = "プロフィールを編集";

export const metadata: Metadata = {
  title,
};

export default async function Page({
  params,
}: {
  params: { userScreenName: string };
}) {
  const session = await getServerAuthSession();
  if (session === null) redirect(loginPath);
  const user = await api.user.getByScreenName(params.userScreenName);
  if (user === null) notFound();
  if (session.user.id !== user.id) notFound();

  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <h1 className="text-center">{title}</h1>
      <EditForm user={user} />
      <DeleteUserLink />
    </div>
  );
}
