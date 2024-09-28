"use client";

import type { User } from "~/entities/user";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { CreatePost } from "./create-post";
import { SelectSocial } from "./[userScreenName]/select-social";
import type { Avatar, AvatarWithUserAndSocial } from "~/entities/avatar";
import type { Social } from "~/entities/social";
import { Posts } from "./posts/posts";
import { useRouter } from "next/navigation";

type AvatarWithSocial = Avatar & { social: Social };

function findDefinedAvatar(
  avatars: AvatarWithSocial[],
  currentSocialId: number,
) {
  if (avatars.length === 0) throw new Error("avatars is empty");
  const avatar = avatars.find((a) => a.social.id === currentSocialId);
  if (avatar === undefined) throw new Error("avatar is undefined");

  return avatar;
}

export function Home({
  user,
  avatars,
}: {
  user: User;
  avatars: AvatarWithSocial[];
}) {
  if (avatars.length < 1) throw new Error("avatars is empty");
  const router = useRouter();
  const initialCurrentSocialId = (() => {
    if (user.currentSocialId !== null) return user.currentSocialId;
    const socials = avatars.map((a) => a.social);
    const social = socials.reduce((a, b) =>
      a.screenName < b.screenName ? a : b,
    );
    return social.id;
  })();
  const [currentSocialId, setCurrentSocialId] = useState(
    initialCurrentSocialId,
  );
  if (currentSocialId === null) throw new Error("currentSocialId is null");
  const { mutate: userUpdateMutate } = api.user.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const socials = avatars === null ? [] : avatars.map((a) => a.social);

  const [avatar, setAvatar] = useState<AvatarWithUserAndSocial>({
    ...findDefinedAvatar(avatars, currentSocialId),
    user: user,
  });
  useEffect(() => {
    userUpdateMutate({ currentSocialId });
    setAvatar({ ...findDefinedAvatar(avatars, currentSocialId), user });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSocialId, userUpdateMutate]);

  const getFollowsQuery = api.follows.getFollowingByAvatarId.useQuery(
    avatar.id,
  );
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  useEffect(() => {
    if (getFollowsQuery.data !== undefined) {
      setFollowingIds(getFollowsQuery.data.map((f) => f.followingId));
    }
  }, [getFollowsQuery.data]);
  const getPostsQuery = api.post.getAllFullyByCreatedByIds.useQuery([
    ...followingIds,
    avatar.id,
  ]);

  return (
    <>
      <SelectSocial
        socials={socials}
        currentSocialId={currentSocialId}
        setCurrentSocialId={setCurrentSocialId}
      />
      <CreatePost
        avatar={avatar}
        getPostsQueryRefetch={getPostsQuery.refetch}
      />
      {getPostsQuery.data !== undefined && <Posts posts={getPostsQuery.data} />}
    </>
  );
}
