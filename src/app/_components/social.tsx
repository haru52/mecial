import Link from "next/link";
import type { Social as SocialEntity } from "~/entities/social";

export function Social({ social }: { social: SocialEntity }) {
  return (
    <Link
      href={`/socials/${social.screenName}`}
      className="mx-auto block w-fit no-underline"
    >
      <div className="card w-80 bg-base-100 shadow-xl sm:w-96">
        <div className="card-body">
          <h2 className="card-title">{social.name}</h2>
          <p>{social.description}</p>
        </div>
      </div>
    </Link>
  );
}
