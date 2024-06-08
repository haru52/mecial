import Link from "next/link";
import type { Social as SocialEntity } from "~/entities/social";

export function Social({ social }: { social: SocialEntity }) {
  return (
    <Link
      href={`/socials/${social.screenName}`}
      className="mx-auto block w-full no-underline"
    >
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{social.name}</h2>
          <p>{social.description}</p>
        </div>
      </div>
    </Link>
  );
}
