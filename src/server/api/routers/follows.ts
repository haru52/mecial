import { z } from "zod";
import { CreateFollows } from "~/entities/follows";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const followsRouter = createTRPCRouter({
  follow: protectedProcedure
    .input(CreateFollows)
    .mutation(async ({ ctx, input }) => {
      if (input.followedById === input.followingId) {
        throw new Error("自分自身をフォローすることはできません");
      }
      const followedBy = await ctx.db.avatar.findUnique({
        where: { id: input.followedById },
      });
      if (followedBy === null) {
        throw new Error("フォローするアバターが見つかりません");
      }
      if (followedBy.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const following = await ctx.db.avatar.findUnique({
        where: { id: input.followingId },
      });
      if (following === null) {
        throw new Error("フォローされるアバターが見つかりません");
      }
      return ctx.db.follows.create({
        data: {
          followedBy: { connect: { id: input.followedById } },
          following: { connect: { id: input.followingId } },
        },
      });
    }),

  unfollow: protectedProcedure
    .input(
      z.object({
        followedById: z.string().uuid(),
        followingId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const follows = await ctx.db.follows.findFirst({
        where: {
          followedById: input.followedById,
          followingId: input.followingId,
        },
        include: {
          followedBy: {
            include: { user: true },
          },
        },
      });
      if (follows === null) {
        throw new Error("フォローしていません");
      }
      if (follows.followedBy.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return ctx.db.follows.delete({
        where: {
          id: follows.id,
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
