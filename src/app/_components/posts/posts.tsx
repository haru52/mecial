import type { PostWithCreatedByUserAndSocial } from "~/entities/post";
import { Post } from "./post";

export function Posts({ posts }: { posts: PostWithCreatedByUserAndSocial[] }) {
  return posts.length >= 1 ? (
    <ul className="list-none pl-0">
      <>
        {posts.map((post) => (
          <li key={post.id} className="mb-0 mt-0.5 pl-0">
            <Post post={post} />
          </li>
        ))}
      </>
    </ul>
  ) : (
    <p>まだポストがありません</p>
  );
}
