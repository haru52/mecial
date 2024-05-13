import { Users } from "../_components/users";
import { api } from "~/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ユーザー",
};

export default async function Page() {
  const users = await api.user.getAll();
  return (
    <main className="container prose mx-auto px-4">
      <h1>Users</h1>
      <Users users={users} />
    </main>
  );
}
