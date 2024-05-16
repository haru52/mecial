import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const followsRouter = createTRPCRouter({
  follow: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      const followedAvatar = await ctx.db.avatar.findUnique({
        where: { id: input },
      });
      if (followedAvatar === null) {
        throw new Error("フォローされるアバターが見つかりません");
      }
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          avatars: {
            select: { id: true },
            where: { socialId: followedAvatar.socialId },
          },
        },
      });
      if (user === null) throw new Error("ログインユーザーが見つかりません");
      const followingAvatar = user.avatars[0];
      if (followingAvatar === undefined) {
        throw new Error("フォローするアバターが見つかりません");
      }
      if (followingAvatar.id === followedAvatar.id) {
        throw new Error("自分自身をフォローすることはできません");
      }
      return ctx.db.follows.create({
        data: {
          followedBy: { connect: { id: followingAvatar.id } },
          following: { connect: { id: input } },
        },
      });
    }),

  unfollow: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      const unfollowedAvatar = await ctx.db.avatar.findUnique({
        where: { id: input },
      });
      if (unfollowedAvatar === null) {
        throw new Error("フォロー解除されるアバターが見つかりません");
      }
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          avatars: {
            select: { id: true },
            where: { socialId: unfollowedAvatar.socialId },
          },
        },
      });
      if (user === null) throw new Error("ログインユーザーが見つかりません");
      const unfollowingAvatar = user.avatars[0];
      if (unfollowingAvatar === undefined) {
        throw new Error("フォロー解除するアバターが見つかりません");
      }
      if (unfollowingAvatar.id === unfollowedAvatar.id) {
        throw new Error("自分自身をフォロー解除することはできません");
      }
      return ctx.db.follows.deleteMany({
        where: {
          followedById: unfollowingAvatar.id,
          followingId: input,
        },
      });
    }),

  isFollowing: publicProcedure
    .input(
      z.object({
        followedById: z.string().uuid(),
        followingId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const follow = await ctx.db.follows.findFirst({
        where: {
          followedById: input.followedById,
          followingId: input.followingId,
        },
      });
      return follow !== null;
    }),

  getFollowingByAvatarId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return ctx.db.follows.findMany({
        where: { followedById: input },
      });
    }),

  getFollowingAvatarsByAvatarId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return ctx.db.follows.findMany({
        where: { followedById: input },
        include: {
          following: {
            include: { user: true, social: true },
          },
        },
      });
    }),

  getFollowingCountByAvatarId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return ctx.db.follows.count({
        where: { followedById: input },
      });
    }),

  getFollowingByAvatarIdWithPosts: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return ctx.db.follows.findMany({
        where: { followedById: input },
        include: {
          following: {
            include: {
              posts: {
                orderBy: { createdAt: "desc" },
              },
            },
          },
        },
      });
    }),

  getFollowerAvatarsByAvatarId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return ctx.db.follows.findMany({
        where: { followingId: input },
        include: {
          followedBy: {
            include: { user: true, social: true },
          },
        },
      });
    }),

  getFollowersCountByAvatarId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return ctx.db.follows.count({
        where: { followingId: input },
      });
    }),
});
