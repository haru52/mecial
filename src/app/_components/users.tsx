import type { User as UserEntity } from "~/entities/user";
import {User} from "./user";

export function Users({ users }: { users: UserEntity[] }) {
  return (
    <div>
      {users.map((user) => (
        <User key={user.screenName} user={user} />
      ))}
    </div>
  );
}
