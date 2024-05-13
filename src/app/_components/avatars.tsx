import type { AvatarWithUserAndSocial } from "~/entities/avatar";
import { Avatar } from "./avatar";

export function Avatars({ avatars, loginAvatarId }: { avatars: AvatarWithUserAndSocial[], loginAvatarId?: string}) {
  return (
    <ul className="list-none pl-0">
      {avatars.map((avatar) => (
        <li key={avatar.id} className="pl-0">
          <Avatar avatar={avatar} loginAvatarId={loginAvatarId} />
        </li>
      ))}
    </ul>
  );
}
