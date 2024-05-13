import { SignupForm } from "../_components/signup-form";
import { getServerAuthSession } from "~/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();
  if (session === null) {
    return null;
  }
  return (
    <main className="container prose mx-auto px-4">
      <h1>サインアップ</h1>
      <SignupForm userId={session.user.id} />
    </main>
  );
}
