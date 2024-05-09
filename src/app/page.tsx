import { getServerAuthSession } from "~/server/auth";
import type { User } from "~/entities/user";
import type {
  Post as PostEntity,
  PostWithCreatedByUser,
} from "~/entities/post";
import { api } from "~/trpc/server";
import { Posts } from "./_components/posts/posts";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreatePost } from "./_components/create-post";
import { SelectSocial } from "./_components/[userScreenName]/select-social";

export default async function Home() {
  const session = await getServerAuthSession();
  const user = session === null ? null : await api.user.getMe();
  if (user?.screenName === null) redirect("/signup"); // 初回ログイン（サインアップ）
  const avatar =
    user?.currentSocialId == null
      ? null
      : await api.avatar.getMyAvatarBySocialIdWithPosts(user.currentSocialId);
  const postsWithCreatedByUser = await (async () => {
    if (avatar === null) return [];
    const follows = await api.follows.getFollowingByAvatarId(avatar.id);
    const followingIds = follows.map((f) => f.followingId);
    return await api.post.getAllByCreatedByIdsWithCreatedByUser([
      ...followingIds,
      avatar.id,
    ]);
  })();
  const avatars = session === null ? null : await api.avatar.getMyAvatarsWithSocial();
  const socials = avatars?.map((a) => a.social);

  return (
    <>
      {session === null && (
        <div
          className="hero min-h-[calc(100vh-68px)]"
          style={{
            backgroundImage: "url(hero.jpeg)",
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
      {session !== null && user?.currentSocialId != null && (
        <>
          <SelectSocial
            socials={socials}
            currentSocialId={user.currentSocialId}
          />
          <CreatePost avatarId={avatar?.id ?? ""} />
        </>
      )}
      {session !== null && (
        <Posts
          posts={postsWithCreatedByUser as unknown as PostWithCreatedByUser[]}
        />
      )}
    </>
  );
}
