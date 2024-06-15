import { SignupForm } from "../_components/signup-form";
import { getServerAuthSession } from "~/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();
  if (session === null) {
    return null;
  }
  return (
    <div className="container prose mx-auto mb-10 mt-5">
      <h1>サインアップ</h1>
      <SignupForm />
    </div>
  );
}
