"use client";

import { Social } from "~/entities/social";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import type { User } from "~/entities/user";

export function JoinSocialButton({
  social,
  user,
}: {
  social: Social;
  user: User;
}) {
  const router = useRouter();
  const { mutate } = api.avatar.create.useMutation();
  const { mutate: userUpdateMutate } = api.user.update.useMutation();

  return (
    <button
      className="btn btn-primary"
      onClick={(e) => {
        e.preventDefault();
        mutate({
          userId: user.id,
          socialId: social.id,
        });
        if (user.currentSocialId === null) {
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
