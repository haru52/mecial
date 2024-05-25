import type { Social } from "~/entities/social";
import { api } from "~/trpc/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getServerAuthSession } from "~/server/auth";

export const metadata: Metadata = {
  title: "ソーシャル",
};

export default async function Page() {
  const session = await getServerAuthSession();
  const socials = await api.social.getAll();
  return (
    <main className="container prose mx-auto px-4">
      <h1>ソーシャル</h1>
      {session !== null && (
        <Link href="/socials/new" className="btn btn-primary">
          ソーシャルを作成
        </Link>
      )}
      <ul>
        {socials.map((social: Social) => (
          <li key={social.id}>
            <Link
              href={`/socials/${social.screenName}`}
            >{`${social.name} (@${social.screenName})`}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
