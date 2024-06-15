import { api } from "~/trpc/server";
import { loginPath } from "~/consts";
import { notFound, redirect } from "next/navigation";
import { EditForm } from "~/app/_components/[userScreenName]/edit-form";
import { getServerAuthSession } from "~/server/auth";
import { DeleteUserLink } from "~/app/_components/delete-user-link";

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
    <div className="container prose mx-auto mb-10 mt-5">
      <h1 className="text-center">{user.name}のプロフィールを編集</h1>
      <EditForm user={user} />
      <DeleteUserLink />
    </div>
  );
}
