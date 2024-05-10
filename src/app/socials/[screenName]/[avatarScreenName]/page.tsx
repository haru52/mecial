import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
      <div className="not-prose avatar">
        <div className="w-24 rounded-full">
          <Image
            src={avatar.user.image ?? ""}
            width={500}
            height={500}
            alt=""
          />
        </div>
      </div>
      <h1>{avatar.user.name}</h1>
      <p>@{avatar.user.screenName}</p>
      <p>{avatar.user.introduction}</p>
      {avatar.user.url !== null && avatar.user.url !== "" && (
        <p>
          <Link href={avatar.user.url} target="_blank" rel="noreferrer">
            {avatar.user.url}
          </Link>
        </p>
      )}
    </>
  );
}
