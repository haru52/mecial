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

  getCurrentMyAvatar: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    console.dir(user);
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

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.avatar.delete({
        where: { id: input },
      });
    }),
});
