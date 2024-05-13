import { CreateSocialForm } from "~/app/_components/socials/create-social-form";

export default function Page() {
  return (
    <main className="container prose mx-auto px-4">
      <h1>ソーシャルを作成</h1>
      <CreateSocialForm />
    </main>
  );
}
