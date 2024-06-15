import Link from "next/link";
import type { Social as SocialEntity } from "~/entities/social";
import Image from "next/image";
import { defaultSocialIconPath } from "~/consts";
import { JoinSocialButton } from "./socials/[screenName]/join-social-button";
import { LeaveSocialButton } from "./socials/[screenName]/leave-social-button";
import type { Avatar } from "~/entities/avatar";

export function Social({
  social,
  avatar,
}: {
  social: SocialEntity;
  avatar: Avatar | undefined;
}) {
  return (
    <Link
      href={`/socials/${social.screenName}`}
      className="mx-auto block w-full no-underline"
    >
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="not-prose avatar">
            <div className="w-11 rounded-full">
              <Image
                src={social.image ?? defaultSocialIconPath}
                width={500}
                height={500}
                alt=""
              />
            </div>
          </div>
          <h2 className="card-title">{social.name}</h2>
          <p>{social.description}</p>
          <div className="card-actions justify-end">
            {avatar === undefined ? (
              <JoinSocialButton social={social} />
            ) : (
              <LeaveSocialButton avatarId={avatar.id} />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
