import { Users } from "../_components/users";
import { api } from "~/trpc/server";

export default async function Page() {
  const users = await api.user.getAll();
  return (
    <div>
      <h1>Users</h1>
      <Users users={users} />
    </div>
  );
}
