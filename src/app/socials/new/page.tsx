import { CreateSocialForm } from "~/app/_components/socials/create-social-form";

export default function Page() {
  return (
    <div className="container prose mx-auto mb-10 mt-5">
      <h1>ソーシャルを作成</h1>
      <CreateSocialForm />
    </div>
  );
}
