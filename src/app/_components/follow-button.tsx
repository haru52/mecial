"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export function FollowButton({
  followedById,
  followingId,
}: {
  followedById: string;
  followingId: string;
}) {
  const router = useRouter();
  const { mutate } = api.follows.follow.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <button
      className="btn btn-primary"
      onClick={(e) => {
        e.preventDefault();
        mutate({ followedById, followingId });
      }}
    >
      フォロー
    </button>
  );
}
