import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Hero } from "./_components/hero";
import { Home as HomeComponent } from "./_components/home";
import Link from "next/link";
import { signupIfNeeds } from "~/server/signup-if-needs";

export default async function Home() {
  const session = await getServerAuthSession();
  const user = session === null ? null : await api.user.getMe();
  await signupIfNeeds({ user });
  const avatars =
    session === null ? null : await api.avatar.getMyAvatarsWithSocial();

  return session === null ? (
    <Hero />
  ) : (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      {user !== null && avatars !== null && avatars.length >= 1 ? (
        <HomeComponent user={user} avatars={avatars} />
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
  );
}
