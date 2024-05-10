"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function UnfollowButton({ avatarId }: { avatarId: string }) {
  const { mutate } = api.follows.unfollow.useMutation();
  const router = useRouter();

  return (
    <button
      className="btn btn-outline btn-primary hover:btn-error after:content-['フォロー中'] hover:after:content-['フォロー解除']"
      onClick={(e) => {
        e.preventDefault();
        mutate(avatarId);
        router.refresh();
      }}
    ></button>
  );
}
