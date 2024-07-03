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
      className="btn btn-outline btn-primary w-32 rounded-full hover:btn-error after:content-['参加中'] hover:after:content-['退出']"
      onClick={(e) => {
        e.preventDefault();
        confirm("本当に退出しますか？") && mutate(avatarId);
      }}
    ></button>
  );
}
