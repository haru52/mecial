"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export function UnfollowButton({
  followedById,
  followingId,
}: {
  followedById: string;
  followingId: string;
}) {
  const router = useRouter();
  const { mutate } = api.follows.unfollow.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <button
      className="btn btn-outline btn-primary w-32 hover:btn-error after:content-['フォロー中'] hover:after:content-['フォロー解除']"
      onClick={(e) => {
        e.preventDefault();
        confirm("本当にフォロー解除しますか？") &&
          mutate({ followedById, followingId });
      }}
    ></button>
  );
}
