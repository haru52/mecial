import { connect } from "http2";
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
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          avatars: {
            select: {
              id: true,
              socialId: true,
            },
          },
        },
      });
      if (user === null) throw new Error("ログインユーザーが見つかりません");
      if (user.avatars.length === 0) {
        throw new Error("ログインアバターが見つかりません");
      }
      const followedAvatar = await ctx.db.avatar.findUnique({
        where: { id: input },
      });
      if (followedAvatar === null) {
        throw new Error("フォローされるアバターが見つかりません");
      }
      const followingAvatar = user.avatars.find(
        (avatar) => avatar.socialId === followedAvatar.socialId,
      );
      if (followingAvatar === undefined)
        throw new Error("フォローするアバターが見つかりません");
      if (
        !user.avatars.some(
          (avatar) => avatar.socialId === followedAvatar.socialId,
        )
      ) {
        throw new Error("フォローするアバターが見つかりません");
      }
      if (followedAvatar.userId === ctx.session.user.id) {
        throw new Error("自分自身をフォローすることはできません");
      }
      return ctx.db.follows.create({
        data: {
          followedBy: { connect: { id: followingAvatar.id } },
          following: { connect: { id: input } },
        },
      });
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
        include: { following: true },
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
        include: { followedBy: true },
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
