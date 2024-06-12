"use client";

import { useState } from "react";
import type { Social } from "~/entities/social";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { defaultSocialIconPath } from "~/consts";
import Link from "next/link";

function getSocialById(socials: Social[], id: number) {
  return socials.find((s) => s.id === id);
}

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
  const [social, setSocial] = useState<Social | undefined>(
    getSocialById(socials, currentSocialId),
  );

  return (
    <div className="flex items-center">
      <div className="not-prose avatar flex-none">
        <div className="w-16 rounded-full">
          <Link href={`/socials/${social?.screenName}`}>
            <Image
              src={social?.image ?? defaultSocialIconPath}
              width={500}
              height={500}
              alt={social?.name ?? "Social icon"}
            />
          </Link>
        </div>
      </div>
      <select
        name="socialId"
        className="select select-bordered ml-6 grow"
        value={socialId}
        onChange={(e) => {
          setSocialId(e.target.value);
          setSocial(socials.find((s) => s.id === parseInt(e.target.value, 10)));
          mutate({
            currentSocialId: parseInt(e.target.value, 10),
          });
        }}
      >
        {socials.map((social) => (
          <option key={social.id} value={social.id}>
            {social.name}
          </option>
        ))}
      </select>
    </div>
  );
}
