"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export function UnfollowButton({
  followedById,
  followingId,
  followingAvatarScreenName,
}: {
  followedById: string;
  followingId: string;
  followingAvatarScreenName: string | null;
}) {
  const router = useRouter();
  const { mutate } = api.follows.unfollow.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <button
      className="btn btn-outline btn-primary w-32 rounded-full hover:btn-error after:content-['フォロー中'] hover:after:content-['フォロー解除']"
      onClick={(e) => {
        e.preventDefault();
        const message =
          followingAvatarScreenName === null
            ? "本当にフォロー解除しますか？"
            : `@${followingAvatarScreenName}さんをフォロー解除しますか？`;
        confirm(message) && mutate({ followedById, followingId });
      }}
    ></button>
  );
}
