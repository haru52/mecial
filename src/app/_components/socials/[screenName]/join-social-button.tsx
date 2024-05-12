"use client";

import type { Social } from "~/entities/social";
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
  const { mutate } = api.avatar.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <button
      className="btn btn-primary"
      onClick={(e) => {
        e.preventDefault();
        mutate({
          socialId: social.id,
        });
      }}
    >
      参加
    </button>
  );
}
