"use client";

import { useRouter } from "next/navigation";
import type { User } from "~/entities/user";
import { api } from "~/trpc/react";

export function EditForm({ user }: { user: User }) {
  const router = useRouter();
  const { mutate, error } = api.user.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate({
          name: e.currentTarget[0].value,
          screenName: e.currentTarget[1].value,
          email: e.currentTarget[2].value,
          image: e.currentTarget[3].value,
        });
      }}
    >
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
        {error?.data?.zodError?.fieldErrors.name && (
          <div className="text-red-500">
            {error.data.zodError.fieldErrors.name}
          </div>
        )}
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
        {
          error?.data?.zodError?.fieldErrors.screenName && (
            <div className="text-red-500">
              {error.data.zodError.fieldErrors.screenName}
            </div>
          )
        }
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">メールアドレス</span>
        </div>
        <input
          type="text"
          placeholder="taroyamada@example.com"
          className="input input-bordered w-full max-w-xs"
          defaultValue={user.email ?? ""}
        />
        {error?.data?.zodError?.fieldErrors.email && (
          <div className="text-red-500">
            {error.data.zodError.fieldErrors.email}
          </div>
        )}
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">アイコン画像URL</span>
        </div>
        <input
          type="text"
          placeholder="https://example.com/taroyamada.jpg"
          className="input input-bordered w-full max-w-xs"
          defaultValue={user.image ?? ""}
        />
        {error?.data?.zodError?.fieldErrors.image && (
          <div className="text-red-500">
            {error.data.zodError.fieldErrors.image}
          </div>
        )}
      </label>
      <div className="form-control mt-7 w-full max-w-xs">
        <input
          type="submit"
          value="保存"
          className="btn btn-primary btn-block"
        />
      </div>
    </form>
  );
}
