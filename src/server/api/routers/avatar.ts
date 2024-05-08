import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { CreateAvatar } from "~/entities/avatar";

export const avatarRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateAvatar)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.avatar.create({
        data: {
          isPrivate: false,
          user: { connect: { id: ctx.session.user.id } },
          social: { connect: { id: input.socialId } },
        },
      });
    }),

  getMyAvatarBySocialId: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.avatar.findFirst({
        where: {
          socialId: input,
          userId: ctx.session.user.id,
        },
      });
    }),

  getMyAvatarBySocialIdWithPosts: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.avatar.findFirst({
        where: {
          socialId: input,
          userId: ctx.session.user.id,
        },
        include: {
          posts: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }),

  getCurrentMyAvatar: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    if (user === null) return null;
    const currentSocialId = user.currentSocialId;
    if (currentSocialId === null) return null;
    return ctx.db.avatar.findFirst({
      where: {
        socialId: currentSocialId,
        userId: ctx.session.user.id,
      },
    });
  }),

  getMyAvatarsWithSocial: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.avatar.findMany({
      where: { userId: ctx.session.user.id },
      include: { social: true },
    });
  }),

  getById: publicProcedure.input(z.string().uuid()).query(({ ctx, input }) => {
    return ctx.db.avatar.findUnique({
      where: { id: input },
    });
  }),

  getBySocialIdAndUserIdWithUser: publicProcedure
    .input(z.object({ socialId: z.number(), userId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.avatar.findFirst({
        where: {
          socialId: input.socialId,
          userId: input.userId,
        },
        include: {
          user: true,
        },
      });
    }),

  // https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/self-relations#many-to-many-self-relations
  // https://github.com/prisma/prisma/discussions/12310
  // https://zenn.dev/ninjin_umigame/articles/89c8100bf6234a

  getFollowingsByUserId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return ctx.db.avatar.findMany({
        where: {
          followedBy: {
            some: {
              followedById: input,
            },
          },
        },
      });
    }),

  getFollowersByUserId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return ctx.db.avatar.findMany({
        where: {
          following: {
            some: {
              followingId: input,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.avatar.delete({
        where: { id: input },
      });
    }),
});
