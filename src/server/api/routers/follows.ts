import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const followsRouter = createTRPCRouter({
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
