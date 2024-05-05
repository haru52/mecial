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

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.avatar.delete({
        where: { id: input },
      });
    }),
});
