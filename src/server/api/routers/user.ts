import { z } from "zod";
import { TRPCError } from "@trpc/server";
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
      const existUser = await ctx.db.user.findUnique({
        where: { screenName: input.screenName ?? "" },
      });
      const exist = existUser !== null;
      if (exist) {
        throw new Error("このIDは既に使われています");
      }
      const defaultData = {
        screenName: input.screenName,
        name: input.name,
        email: input.email,
        image: input.image,
      };
      const data = (() => {
        if (input.currentSocialId === undefined) return defaultData;
        if (input.currentSocialId === null) return { ...defaultData, currentSocialId: null };
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

  checkIfScreenNameExists: protectedProcedure
    .input(
      z
        .string({ invalid_type_error: "文字列を入力してください" })
        .min(1, { message: "IDを入力してください" })
        .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
          message:
            "半角英数字とアンダースコア（_）のみ使用できます。また、先頭は半角英字にする必要があります",
        }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { screenName: input },
      });
      console.log("!!user", !!user);
      return !!user;
    }),
});
