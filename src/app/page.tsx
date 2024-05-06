import { getServerAuthSession } from "~/server/auth";
import type { User } from "~/entities/user";
import type { Post as PostEntity } from "~/entities/post";
import { api } from "~/trpc/server";
import { Posts } from "./_components/posts/posts";
import Link from "next/link";
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerAuthSession();
  const user = session === null ? null : await api.user.getMe();
  if (user?.screenName === null) redirect('/signup'); // 初回ログイン（サインアップ）
  const avatar = user?.currentSocialId == null ? null : await api.avatar.getMyAvatarBySocialIdWithPosts(user.currentSocialId);
  const posts = avatar?.posts === null ? [] : (avatar?.posts as PostEntity[]);

  return (
    <>
      {session !== null ? (
        <Posts user={user as User} posts={posts} />
      ) : (
        <div
          className="hero min-h-screen"
          style={{
            backgroundImage:
              "url(hero.jpeg)",
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Mecial</h1>
              <p className="mb-5">
                Mecial（ミーシャル）はメタSNSです。
              </p>
              <Link href="api/auth/signin" className="btn btn-primary">ログイン</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
