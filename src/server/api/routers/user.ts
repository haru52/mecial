import { z } from "zod";
import { UpdateUser } from "~/entities/user";
import { ScreenName } from "~/zod/zodSchemas";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(UpdateUser)
    .mutation(async ({ ctx, input }) => {
      const existUser = await ctx.db.user.findUnique({
        where: { screenName: input.screenName ?? "" },
      });
      const exist = existUser !== null;
      if (exist && existUser?.id !== ctx.session.user.id) {
        throw new Error("このIDは既に使われています");
      }
      const defaultData = {
        screenName: input.screenName,
        name: input.name,
        email: input.email,
        image: input.image === "" ? null : input.image,
        introduction: input.introduction === "" ? null : input.introduction,
        url: input.url === "" ? null : input.url,
      };
      const data = (() => {
        if (input.currentSocialId === undefined) return defaultData;
        if (input.currentSocialId === null)
          return { ...defaultData, currentSocialId: null };
        return {
          ...defaultData,
          currentSocial: { connect: { id: input.currentSocialId } },
        };
      })();
      return ctx.db.user.update({
        data,
        where: { id: ctx.session.user.id },
      });
    }),

  getById: publicProcedure.input(z.string().uuid()).query(({ ctx, input }) => {
    return ctx.db.user.findFirst({
      where: { id: input },
    });
  }),

  getMe: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findFirst({
      where: { id: ctx.session.user.id },
    });
  }),

  getByIdWithAvatars: publicProcedure
    .input(z.string().uuid())
    .query(({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: { id: input },
        include: {
          avatars: true,
        },
      });
    }),

  getByScreenName: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.user.findFirst({
      where: { screenName: input },
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      orderBy: { screenName: "asc" },
    });
  }),

  checkIfScreenNameExists: protectedProcedure
    .input(ScreenName)
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { screenName: input },
      });
      return !!user;
    }),

  delete: protectedProcedure.mutation(({ ctx }) => {
    return ctx.db.user.delete({
      where: { id: ctx.session.user.id },
    });
  }),
});
