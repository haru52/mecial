import type { User } from "~/entities/user";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { EditForm } from "~/app/_components/[userScreenName]/edit-form";
import { getServerAuthSession } from "~/server/auth";

export default async function Page({
  params,
}: {
  params: { userScreenName: string };
}) {
  const session = await getServerAuthSession();
  if (session === null) throw new Error("Unauthorized");
  const rawUser = await api.user.getByScreenName(params.userScreenName);
  const user = rawUser as User;
  if (user === null) return notFound();

  return (
    <>
      <h1 className="text-center">{user.name} のプロフィールを編集</h1>
      <EditForm user={user} />
    </>
  );
}
