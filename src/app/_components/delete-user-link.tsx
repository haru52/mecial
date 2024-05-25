"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

export function DeleteUserLink() {
  const router = useRouter();
  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      alert("アカウントを削除しました");
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      alert(`アカウント削除に失敗しました。\n${error.message}`);
    },
  });

  const handleDeleteUser = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault();
    if (deleteUser.isPending) return;
    if (!confirm("本当にアカウントを削除しますか？")) {
      return;
    }
    deleteUser.mutate();
  };

  return (
    <p className="mt-12 text-center">
      <a
        className="link link-error"
        onClick={handleDeleteUser}
        aria-disabled={deleteUser.isPending}
      >
        アカウントを削除
      </a>
    </p>
  );
}
