"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function LeaveSocialButton({ avatarId }: { avatarId: string }) {
  const router = useRouter();
  const { mutate } = api.avatar.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <button
      className="btn btn-error"
      onClick={(e) => {
        e.preventDefault();
        mutate(avatarId);
      }}
    >
      退出
    </button>
  );
}
