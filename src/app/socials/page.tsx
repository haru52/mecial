import { api } from "~/trpc/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getServerAuthSession } from "~/server/auth";
import { Socials } from "../_components/socials";

export const metadata: Metadata = {
  title: "ソーシャル",
};

export default async function Page() {
  const session = await getServerAuthSession();
  const socials = await api.social.getAll();
  const avatars = await api.avatar.getMyAvatars();
  return (
    <div className="container prose mx-auto mb-10 mt-5">
      <h1 className="text-center">ソーシャル</h1>
      {session !== null && (
        <Link href="/socials/new" className="btn btn-primary">
          ソーシャルを作成
        </Link>
      )}
      <Socials socials={socials} avatars={avatars} />
    </div>
  );
}
