import type { Metadata } from "next";
import type { Social } from "~/entities/social";
import Link from "next/link";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Image from "next/image";
import { defaultUserAndAvatarIconPath } from "~/consts";
import { Socials } from "../_components/socials";
import { Posts } from "../_components/posts/posts";

export const generateMetadata = async ({
  params,
}: {
  params: { userScreenName: string };
}): Promise<Metadata> => {
  const user = await api.user.getByScreenName(params.userScreenName);
  if (user === null) return { title: "404 Not Found" };

  return {
    title: `${user.name}（@${user.screenName}）さん`,
  };
};

function compare(a: Social, b: Social) {
  if (a.screenName < b.screenName) {
    return -1;
  }
  if (a.screenName > b.screenName) {
    return 1;
  }
  return 0;
}

export default async function Page({
  params,
}: {
  params: { userScreenName: string };
}) {
  const user = await api.user.getByScreenNameWithSocials(params.userScreenName);
  const session = await getServerAuthSession();
  const loginUser = session === null ? null : await api.user.getMeWithAvatars();

  if (user === null) return notFound();
  const socials = user.avatars.map((avatar) => avatar.social).sort(compare);
  const posts = await api.post.getAllByUserId(user.id);
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <div className="flex items-end">
        <div className="not-prose avatar mr-auto">
          <div className="w-24 rounded-full">
            <Image
              src={user.image ?? defaultUserAndAvatarIconPath}
              width={500}
              height={500}
              alt=""
              priority={true}
            />
          </div>
        </div>
        {session?.user.id === user.id && (
          <Link
            href={`${user.screenName}/edit`}
            className="btn btn-primary mr-0 rounded-full"
          >
            プロフィールを編集
          </Link>
        )}
      </div>
      <h1 className="mb-0 mt-5">{user.name}</h1>
      <p className="mt-0">@{user.screenName}</p>
      <p>{user.introduction}</p>
      {user.url !== null && (
        <p>
          <Link
            href={user.url}
            target="_blank"
            rel="noreferrer"
            className="link link-primary"
          >
            {decodeURI(user.url)}
          </Link>
        </p>
      )}
      <p>{`${user.createdAt.getFullYear()}年${user.createdAt.getMonth() + 1}月からMecialを利用しています`}</p>
      <h2>参加中のソーシャル</h2>
      <Socials
        socials={socials}
        avatars={loginUser === null ? null : loginUser.avatars}
        isSignedUp={session !== null && loginUser?.screenName != null}
      />
      <h2>ポスト</h2>
      <Posts posts={posts} />
    </div>
  );
}
