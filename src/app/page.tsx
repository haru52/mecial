import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Hero } from "./_components/hero";
import { redirect } from "next/navigation";
import { clsx } from "clsx";
import { Home } from "./_components/home";
import Link from "next/link";

export default async function Page() {
  const session = await getServerAuthSession();
  const user = session === null ? null : await api.user.getMe();
  if (user !== null && user.screenName === null) redirect("/signup"); // 初回ログイン（サインアップ）
  const avatars =
    session === null ? null : await api.avatar.getMyAvatarsWithSocial();

  return (
    <div className={clsx({ "container prose mx-auto px-4": session !== null })}>
      {session === null ? (
        <Hero />
      ) : (
        <div className="mt-10">
          {user !== null && avatars !== null && avatars.length >= 1 ? (
            <Home user={user} avatars={avatars} />
          ) : (
            <p>
              まだ
              <Link href="/socials" className="not-prose link-hover link">
                ソーシャル
              </Link>
              に参加していません
            </p>
          )}
        </div>
      )}
    </div>
  );
}
