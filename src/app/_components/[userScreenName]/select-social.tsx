"use client";

import { useState } from "react";
import type { Social } from "~/entities/social";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function SelectSocial({
  socials,
  currentSocialId,
}: {
  socials: Social[];
  currentSocialId: number;
}) {
  const router = useRouter();
  const { mutate } = api.user.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const [socialId, setSocialId] = useState(currentSocialId.toString());

  return (
    <select
      name="socialId"
      className="select select-bordered w-full"
      value={socialId}
      onChange={(e) => {
        setSocialId(e.target.value);
        mutate({
          currentSocialId: parseInt(e.target.value, 10),
        });
      }}
    >
      {socials.map((social) => (
        <option
          key={social.id}
          value={social.id}
          defaultValue={currentSocialId}
        >
          {social.name}
        </option>
      ))}
    </select>
  );
}
