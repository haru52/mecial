"use client";

import type { Social } from "~/entities/social";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function JoinSocialButton({ social }: { social: Social }) {
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
