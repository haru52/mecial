import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <>
      <h1>Hello {session?.user?.name ?? "world"}!</h1>
      <p>{hello.greeting}</p>
    </>
  );
}
