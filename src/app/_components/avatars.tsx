import type { AvatarWithUser } from "~/entities/avatar";
import { Avatar } from "./avatar";

export function Avatars({ avatars }: { avatars: AvatarWithUser[] }) {
  return (
    <ul className="list-none pl-0">
      {avatars.map((avatar) => (
        <li key={avatar.id} className="pl-0">
          <Avatar avatar={avatar} />
        </li>
      ))}
    </ul>
  );
}
