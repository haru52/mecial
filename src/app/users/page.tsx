import { Users } from "../_components/users";
import { api } from "~/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ユーザー",
};

export default async function Page() {
  const users = await api.user.getAll();
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <h1 className="text-center">ユーザー</h1>
      <Users users={users} />
    </div>
  );
}
