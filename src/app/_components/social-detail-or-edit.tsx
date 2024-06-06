"use client";

import { useState } from "react";
import { SocialDetail } from "./social-detail";
import { SocialEdit } from "./social-edit";
import type { SocialWithAvatarUsersAndAdministrator } from "~/entities/social";
import type { User } from "~/entities/user";
import type { PostWithCreatedByUserAndSocial } from "~/entities/post";
import type { Avatar } from "~/entities/avatar";

export function SocialDetailOrEdit({
  social,
  user,
  avatar,
  posts,
}: {
  social: SocialWithAvatarUsersAndAdministrator;
  user: User | null;
  avatar: Avatar | null;
  posts: PostWithCreatedByUserAndSocial[];
}) {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <SocialEdit social={social} setIsEditing={setIsEditing} />
  ) : (
    <SocialDetail
      social={social}
      user={user}
      avatar={avatar}
      posts={posts}
      setIsEditing={setIsEditing}
    />
  );
}
