import { z } from "zod";
import { User } from "~/entities/user";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(User)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        data: {
          screenName: input.screenName,
          name: input.name,
          email: input.email,
          image: input.image,
        },
        where: { id: ctx.session.user.id },
      });
    }),

  getById: publicProcedure.input(z.string().uuid()).query(({ ctx, input }) => {
    return ctx.db.user.findFirst({
      where: { id: input },
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
});
