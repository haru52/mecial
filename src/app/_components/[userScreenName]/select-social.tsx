"use client";

import { useState } from "react";
import type { Social } from "~/entities/social";
import Image from "next/image";
import { defaultSocialIconPath } from "~/consts";
import Link from "next/link";

function getSocialById(socials: Social[], id: number) {
  return socials.find((s) => s.id === id);
}

function sortByScreenName(a: Social, b: Social) {
  return a.screenName.localeCompare(b.screenName);
}

export function SelectSocial({
  socials,
  currentSocialId,
  setCurrentSocialId,
}: {
  socials: Social[];
  currentSocialId: number;
  setCurrentSocialId: (id: number) => void;
}) {
  const [social, setSocial] = useState<Social | undefined>(
    getSocialById(socials, currentSocialId),
  );

  if (social === undefined) return null;

  return (
    <div className="flex items-center">
      <div className="not-prose avatar flex-none">
        <div className="w-16 rounded-full">
          <Link href={`/socials/${social?.screenName}`}>
            <Image
              src={social.image ?? defaultSocialIconPath}
              width={500}
              height={500}
              alt={social.name ?? "Social icon"}
            />
          </Link>
        </div>
      </div>
      <select
        name="socialId"
        className="select select-bordered ml-6 grow"
        value={currentSocialId.toString()}
        onChange={(e) => {
          setCurrentSocialId(parseInt(e.target.value, 10));
          setSocial(socials.find((s) => s.id === parseInt(e.target.value, 10)));
        }}
      >
        {socials.sort(sortByScreenName).map((social) => (
          <option key={social.id} value={social.id.toString()}>
            {social.name}
          </option>
        ))}
      </select>
    </div>
  );
}
