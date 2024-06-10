import type { Social as SocialEntity } from "~/entities/social";
import { Social } from "./social";

export function Socials({ socials }: { socials: SocialEntity[] }) {
  return socials.length === 0 ? (
    <p>まだソーシャルがありません</p>
  ) : (
    <ul className="list-none pl-0">
      {socials.map((social) => (
        <li key={social.id} className="mb-0 mt-1 pl-0">
          <Social social={social} />
        </li>
      ))}
    </ul>
  );
}
