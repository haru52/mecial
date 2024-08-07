import { CreateSocialForm } from "~/app/_components/socials/create-social-form";

export default function Page() {
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <h1 className="text-center">ソーシャルを作成</h1>
      <CreateSocialForm />
    </div>
  );
}
