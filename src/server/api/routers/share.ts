import type { PrismaClient } from "@prisma/client";
import type { Social } from "~/entities/social";

function sortSocialsByScreenName(arr: Social[]) {
  return arr.sort((a, b) => a.screenName.localeCompare(b.screenName));
}

export async function updateCurrentSocial(db: PrismaClient, userId: string) {
  const user = await db.user.findFirst({
    where: { id: userId },
    include: {
      avatars: {
        include: {
          social: true,
        },
      },
    },
  });
  if (user === null) throw new Error("ユーザーが見つかりません");
  const avatars = user.avatars;
  const socials = avatars.map((avatar) => avatar.social);
  if (
    user.currentSocialId !== null &&
    socials.some((social) => social.id === user.currentSocialId)
  ) {
    return;
  }
  if (avatars.length === 0 || socials.length === 0) {
    return db.user.update({
      data: {
        currentSocial: {
          disconnect: true,
        },
      },
      where: { id: userId },
    });
  }
  const social = sortSocialsByScreenName(socials)[0];
  if (social === undefined) {
    return db.user.update({
      data: {
        currentSocial: {
          disconnect: true,
        },
      },
      where: { id: userId },
    });
  }
  return db.user.update({
    data: {
      currentSocial: {
        connect: {
          id: social.id,
        },
      },
    },
    where: { id: userId },
  });
}
