import { SignupForm } from "../_components/signup-form";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Page() {
  const session = await getServerAuthSession();
  if (session === null) {
    return null;
  }
  const user = await api.user.getMe();
  if (user === null) {
    return null;
  }
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <h1 className="text-center">サインアップ</h1>
      <SignupForm user={user} />
    </div>
  );
}
