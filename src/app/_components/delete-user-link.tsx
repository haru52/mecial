"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function DeleteUserLink() {
  const deleteUser = api.user.delete.useMutation();
  const router = useRouter();

  const handleDeleteUser = () => {
    if (!confirm("本当にアカウントを削除しますか？")) {
      return;
    }
    deleteUser.mutate();
    router.push("/");
    router.refresh();
  };

  return (
    <p className="mt-12 text-center">
      <a className="link link-error" onClick={handleDeleteUser}>
        アカウントを削除
      </a>
    </p>
  );
}
