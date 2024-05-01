import type { Post as PostEntity } from "~/entities/post";
import type { User } from "~/entities/user";

export function Post({ user, post }: { user: User; post: PostEntity }) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{user.name}</h2>
        <p>{post.content}</p>
        <p>{`${post.createdAt.toLocaleString('ja-JP')}`}</p>
      </div>
    </div>
  );
}
