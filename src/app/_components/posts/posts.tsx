import type { Post as PostEntity, PostWithCreatedByUser } from "~/entities/post";
import type { User } from "~/entities/user";
import { Post } from "./post";

export function Posts({ posts }: { posts: PostWithCreatedByUser[] }) {
  return (
    <>
      {posts.length >= 1 ? (
        <ul>
          <>
            {posts.map((post) => (
              <div key={post.id} className="mt-5">
                <Post post={post} />
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
