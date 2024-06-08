import { getServerAuthSession } from "~/server/auth";
import hero from "../../public/hero.jpeg";
import { api } from "~/trpc/server";
import { Posts } from "./_components/posts/posts";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreatePost } from "./_components/create-post";
import { SelectSocial } from "./_components/[userScreenName]/select-social";
import { clsx } from "clsx";

export default async function Home() {
  const session = await getServerAuthSession();
  const user = session === null ? null : await api.user.getMe();
  if (user !== null && user.screenName === null) redirect("/signup"); // 初回ログイン（サインアップ）
  const avatar =
    user?.currentSocialId == null
      ? null
      : await api.avatar.getMyAvatarBySocialIdWithPosts(user.currentSocialId);
  const postsWithCreatedByUser = await (async () => {
    if (avatar === null) return [];
    const follows = await api.follows.getFollowingByAvatarId(avatar.id);
    const followingIds = follows.map((f) => f.followingId);
    return await api.post.getFullAllByCreatedByIds([
      ...followingIds,
      avatar.id,
    ]);
  })();
  const avatars =
    session === null ? null : await api.avatar.getMyAvatarsWithSocial();
  const socials = avatars?.map((a) => a.social);

  return (
    <div className={clsx({ "container prose mx-auto px-4": session !== null })}>
      {session === null && (
        <div
          className="hero min-h-[calc(100vh-68px)]"
          style={{
            backgroundImage: `url(${hero.src})`,
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Mecial</h1>
              <p className="mb-5">Mecial（ミーシャル）はメタSNSです。</p>
              <Link href="api/auth/signin" className="btn btn-primary">
                ログイン
              </Link>
            </div>
          </div>
        </div>
      )}
      {session !== null &&
        user?.currentSocialId != null &&
        socials !== undefined && (
          <>
            <SelectSocial
              socials={socials}
              currentSocialId={user.currentSocialId}
            />
            <CreatePost avatarId={avatar?.id ?? ""} />
          </>
        )}
      {session !== null && <Posts posts={postsWithCreatedByUser} />}
    </div>
  );
}
