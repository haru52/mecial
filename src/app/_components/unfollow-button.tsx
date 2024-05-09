"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function UnfollowButton({ avatarId }: { avatarId: string }) {
  const { mutate } = api.follows.unfollow.useMutation();
  const router = useRouter();

  return (
    <button
      className="btn btn-outline btn-primary"
      onClick={(e) => {
        e.preventDefault();
        mutate(avatarId);
        router.refresh();
      }}
    >
      フォロー中
    </button>
  );
}
