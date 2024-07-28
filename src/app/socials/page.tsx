import { api } from "~/trpc/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getServerAuthSession } from "~/server/auth";
import { Socials } from "../_components/socials";
import { signupIfNeeds } from "~/server/signup-if-needs";

export const metadata: Metadata = {
  title: "ソーシャル",
};

export default async function Page() {
  const session = await getServerAuthSession();
  await signupIfNeeds({ session });
  const socials = await api.social.getAll();
  const avatars = session === null ? null : await api.avatar.getMyAvatars();
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <h1 className="text-center">ソーシャル</h1>
      {session !== null && (
        <Link
          href="/socials/new"
          className="btn btn-primary w-full rounded-full"
        >
          ソーシャルを作成
        </Link>
      )}
      <Socials
        socials={socials}
        avatars={avatars}
        isSignedUp={session !== null}
      />
    </div>
  );
}
