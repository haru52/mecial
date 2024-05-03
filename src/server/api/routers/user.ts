import { z } from "zod";
import { UpdateUser } from "~/entities/user";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(UpdateUser)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        data: {
          screenName: input.screenName,
          name: input.name,
          email: input.email,
          image: input.image,
        },
        where: { id: input.id },
      });
    }),

  getById: publicProcedure.input(z.string().uuid()).query(({ ctx, input }) => {
    return ctx.db.user.findFirst({
      where: { id: input },
    });
  }),

  getByIdWithPosts: publicProcedure
    .input(z.string().uuid())
    .query(({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: { id: input },
        include: {
          posts: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }),

  getByScreenName: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.user.findFirst({
      where: { screenName: input },
    });
  }),

  getByScreenNameWithPosts: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: { screenName: input },
        include: {
          posts: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      orderBy: { screenName: "asc" },
    });
  }),

});
