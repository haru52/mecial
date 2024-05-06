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
  const { mutate } = api.user.update.useMutation();
  const router = useRouter();
  const [socialId, setSocialId] = useState(currentSocialId.toString());

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutate({
        currentSocialId: parseInt(socialId, 10),
      });
      router.refresh();
    }}>
      <label className="form-control w-full max-w-xs">
        <span className="label">現在のソーシャル</span>
        <select name="socialId" className="select w-full max-w-xs" value={socialId} onChange={(e) => setSocialId(e.target.value)}>
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
      </label>
      <div className="form-control mt-5 w-full max-w-xs">
        <input
          type="submit"
          value="移動する"
          className="btn btn-primary btn-block"
        />
      </div>
    </form>
  );
}
