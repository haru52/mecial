import type { Social as SocialEntity } from "~/entities/social";
import { Social } from "./social";

export function Socials({ socials }: { socials: SocialEntity[] }) {
  return (
    <ul className="list-none pl-0">
      {socials.map((social) => (
        <li key={social.id} className="pl-0">
          <Social social={social} />
        </li>
      ))}
    </ul>
  );
}
