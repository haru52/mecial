"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function FollowButton({ avatarId }: { avatarId: string }) {
  const { mutate } = api.follows.follow.useMutation();
  const router = useRouter();

  return (
    <button
      className="btn btn-primary"
      onClick={(e) => {
        e.preventDefault();
        mutate(avatarId);
        router.refresh();
      }}
    >
      フォロー
    </button>
  );
}