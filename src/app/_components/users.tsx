import type { User as UserEntity } from "~/entities/user";
import { User } from "./user";

export function Users({ users }: { users: UserEntity[] }) {
  return (
    <ul className="list-none pl-0">
      {users.map((user) => (
        <li key={user.screenName} className="mb-0 mt-0.5 pl-0">
          <User user={user} />
        </li>
      ))}
    </ul>
  );
}
