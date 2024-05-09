import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: { screenName: string; avatarScreenName: string };
}) {
  const avatar = await api.avatar.getByScreenNameWithUser(
    params.avatarScreenName,
  );
  if (avatar === null) notFound();

  return (
    <>
      <div className="avatar not-prose">
        <div className="w-24 rounded-full">
          <Image src={avatar.user.image ?? ''} width={500} height={500} alt=""/>
        </div>
      </div>
      <h1>{avatar.user.name}</h1>
      <p>@{avatar.user.screenName}</p>
    </>
  );
}
