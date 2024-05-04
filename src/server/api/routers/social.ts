import { z } from "zod";
import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const socialRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.social.findMany({
      orderBy: { screenName: "asc" },
    });
  }),

  getByScreenName: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.social.findFirst({
        where: { screenName: input },
      });
    }),
});
