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
  isLoggedIn,
}: {
  social: SocialEntity;
  avatar: Avatar | undefined;
  isLoggedIn: boolean;
}) {
  return (
    <Link
      href={`/socials/${social.screenName}`}
      className="w-full no-underline"
    >
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="card-title">
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
            <div>
              <h2 className="card-title my-0">{social.name}</h2>
              <p className="my-0 text-sm">@{social.screenName}</p>
            </div>
          </div>
          <p className="my-0">{social.description}</p>
          {isLoggedIn && (
            <div className="card-actions justify-end">
              {avatar === undefined ? (
                <JoinSocialButton social={social} />
              ) : (
                <LeaveSocialButton avatarId={avatar.id} />
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
