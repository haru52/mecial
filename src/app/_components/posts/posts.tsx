import type { Post as PostEntity } from "~/entities/post";
import type { User } from "~/entities/user";
import { Post } from "./post";

export function Posts({ user, posts }: { user: User; posts: PostEntity[] }) {
  return (
    <>
      {posts.length > 1 ? (
        <ul>
          <>
            {posts.map((post) => (
              <div key={post.id} className="mt-5">
                <Post post={post} key={post.id} user={user} />
              </div>
            ))}
          </>
        </ul>
      ) : (
        <p>まだポストがありません</p>
      )}
    </>
  );
}
