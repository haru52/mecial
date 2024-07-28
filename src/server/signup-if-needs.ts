import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import type { User } from "~/entities/user";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export async function signupIfNeeds(
  params: { user?: User | null; session?: Session | null } = {
    user: undefined,
    session: undefined,
  },
) {
  const { user, session } = params;
  const loginUser = await (async () => {
    if (user != null) return user;
    const loginSession = session ?? (await getServerAuthSession());
    if (loginSession === null) return null;
    return await api.user.getMe();
  })();
  if (loginUser !== null && loginUser.screenName === null) redirect("/signup");
}
