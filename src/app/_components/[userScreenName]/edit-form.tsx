"use client";

import type { User } from "~/entities/user";

export function EditForm({ user }: { user: User }) {
  return (
    <form>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">名前</span>
        </div>
        <input
          type="text"
          placeholder="山田 太郎"
          className="input input-bordered w-full max-w-xs"
          defaultValue={user.name ?? ""}
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">ID</span>
        </div>
        <input
          type="text"
          placeholder="taroyamada"
          className="input input-bordered w-full max-w-xs"
          defaultValue={user.screenName ?? ""}
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">メールアドレス</span>
        </div>
        <input
          type="email"
          placeholder="taroyamada@example.com"
          className="input input-bordered w-full max-w-xs"
          defaultValue={user.email ?? ""}
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">メールアドレス</span>
        </div>
        <input
          type="email"
          placeholder="taroyamada@example.com"
          className="input input-bordered w-full max-w-xs"
          defaultValue={user.email ?? ""}
        />
      </label>
      <div className="form-control w-full max-w-xs mt-7">
        <input
          type="submit"
          value="保存"
          className="btn btn-primary btn-block"
        />
      </div>
    </form>
  );
}
