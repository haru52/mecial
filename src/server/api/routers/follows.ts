import { connect } from "http2";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const followsRouter = createTRPCRouter({
  follow: protectedProcedure.input(z.string().uuid()).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    if (user === null) throw new Error("ユーザーが見つかりません");
    if (user.id === input) throw new Error("自分自身をフォローすることはできません");
    if (user.currentSocialId === null) throw new Error("どのソーシャルにも属していません");
    const avatar = await ctx.db.avatar.findFirst({
      where: { socialId: user.currentSocialId },
    });
    if (avatar === null) throw new Error("アバターが見つかりません");
    return ctx.db.follows.create({
      data: {
        followedBy: { connect: { id: avatar.id } },
        following: {connect: {id: input}},
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
