"use client";

import { Social } from "~/entities/social";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function JoinSocialButton({
  social,
  currentSocialId,
}: {
  social: Social;
  currentSocialId: number | null;
}) {
  console.debug( {currentSocialId});
  const router = useRouter();
  const { mutate } = api.avatar.create.useMutation();
  const { mutate: userUpdateMutate } = api.user.update.useMutation();

  return (
    <button
      className="btn btn-primary"
      onClick={(e) => {
        e.preventDefault();
        mutate({
          socialId: social.id,
        });
        if (currentSocialId === null) {
          userUpdateMutate({
            currentSocialId: social.id,
          });
        }
        router.refresh();
      }}
    >
      参加
    </button>
  );
}
