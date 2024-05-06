"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function LeaveSocialButton({ avatarId, avatarsLength }: { avatarId: string, avatarsLength: number}) {
  const router = useRouter();
  const { mutate } = api.avatar.delete.useMutation();
  const { mutate: userUpdateMutate } = api.user.update.useMutation();

  return (
    <button
      className="btn btn-error"
      onClick={(e) => {
        e.preventDefault();
        mutate(avatarId);
        if (avatarsLength === 1) {
          userUpdateMutate({
            currentSocialId: null,
          });
        }
        router.refresh();
      }}
    >
      退出
    </button>
  );
}
