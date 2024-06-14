"use client";

import type { User } from "~/entities/user";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { CreatePost } from "./create-post";
import { SelectSocial } from "./[userScreenName]/select-social";
import type { Avatar, AvatarWithUserAndSocial } from "~/entities/avatar";
import type { Social } from "~/entities/social";
import { Posts } from "./posts/posts";

type AvatarWithSocial = Avatar & { social: Social };

function findDefinedAvatar(
  avatars: AvatarWithSocial[],
  currentSocialId: number,
) {
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
  const [currentSocialId, setCurrentSocialId] = useState(user.currentSocialId);
  if (currentSocialId === null) throw new Error("currentSocialId is null");
  const { mutate: userUpdateMutate } = api.user.update.useMutation();
  const socials = avatars === null ? [] : avatars.map((a) => a.social);

  const [avatar, setAvatar] = useState<AvatarWithUserAndSocial>({
    ...findDefinedAvatar(avatars, currentSocialId),
    user: user,
  });
  useEffect(() => {
    userUpdateMutate({ currentSocialId });
    setAvatar({ ...findDefinedAvatar(avatars, currentSocialId), user: user });
  }, [currentSocialId, avatars, user, userUpdateMutate]);

  const getFollowsQuery = api.follows.getFollowingByAvatarId.useQuery(
    avatar.id,
  );
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  useEffect(() => {
    if (getFollowsQuery.data !== undefined) {
      setFollowingIds(getFollowsQuery.data.map((f) => f.followingId));
    }
  }, [getFollowsQuery.data]);
  const getPostsQuery = api.post.getFullAllByCreatedByIds.useQuery([
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
