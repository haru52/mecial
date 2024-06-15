import type { Social as SocialEntity } from "~/entities/social";
import { Social } from "./social";
import type { Avatar } from "~/entities/avatar";

export function Socials({
  socials,
  avatars,
  isLoggedIn,
}: {
  socials: SocialEntity[];
  avatars: Avatar[] | null;
  isLoggedIn: boolean;
}) {
  return socials.length === 0 ? (
    <p>まだソーシャルがありません</p>
  ) : (
    <ul className="list-none pl-0">
      {socials.map((social) => {
        const avatar = avatars?.find((avatar) => avatar.socialId === social.id);
        return (
          <li key={social.id} className="mb-0 mt-0.5 pl-0">
            <Social social={social} avatar={avatar} isLoggedIn={isLoggedIn} />
          </li>
        );
      })}
    </ul>
  );
}
