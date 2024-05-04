import { SignupForm } from "../_components/signup-form";
import { getServerAuthSession } from "~/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();
  if (session === null) {
    return null;
  }
  return (
    <>
      <h1>サインアップ</h1>
      <SignupForm userId={session.user.id} />
    </>
  );
}
