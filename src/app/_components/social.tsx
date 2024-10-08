import Link from "next/link";
import type { Social as SocialEntity } from "~/entities/social";
import Image from "next/image";
import { defaultSocialIconPath } from "~/consts";
import { JoinSocialButton } from "./socials/[screenName]/join-social-button";
import { LeaveSocialButton } from "./socials/[screenName]/leave-social-button";
import type { Avatar } from "~/entities/avatar";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Social({
  social,
  avatar,
  isSignedUp,
}: {
  social: SocialEntity;
  avatar: Avatar | undefined;
  isSignedUp: boolean;
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
              <h2 className="card-title my-0 flex items-center gap-2">
                <span>{social.name}</span>
                {social.isPrivate && (
                  <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
                )}
              </h2>
              <p className="my-0 text-sm">@{social.screenName}</p>
            </div>
          </div>
          <p className="my-0">{social.description}</p>
          {isSignedUp && (
            <div className="card-actions justify-end">
              {avatar === undefined ? (
                <JoinSocialButton social={social} />
              ) : (
                <LeaveSocialButton
                  avatarId={avatar.id}
                  socialScreenName={social.screenName}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
