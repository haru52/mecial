import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { CreateSocial, UpdateSocial } from "~/entities/social";
import { ScreenName } from "~/zod/zod-schemas";
import { TRPCError } from "@trpc/server";

export const socialRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateSocial)
    .mutation(async ({ ctx, input }) => {
      const screenNameExists = await ctx.db.social.findUnique({
        where: { screenName: input.screenName },
      });
      if (screenNameExists !== null) {
        throw new Error("このIDはすでに使われています");
      }
      return ctx.db.social.create({
        data: {
          screenName: input.screenName,
          isPrivate: input.isPrivate,
          name: input.name,
          image: input.image,
          description: input.description,
          url: input.url,
          createdBy: { connect: { id: ctx.session.user.id } },
          administrator: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.social.findMany({
      orderBy: { screenName: "asc" },
    });
  }),

  getByScreenName: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.social.findFirst({
      where: { screenName: input },
    });
  }),

  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.social.findFirst({
      where: { id: input },
    });
  }),

  getByScreenNameWithAvatarUsers: publicProcedure
    .input(ScreenName)
    .query(({ ctx, input }) => {
      return ctx.db.social.findUnique({
        where: { screenName: input },
        include: {
          avatars: {
            where: { isPrivate: false },
            include: { user: true, social: true },
          },
        },
      });
    }),

  getByScreenNameWithAvatarUsersAndAdministrator: publicProcedure
    .input(ScreenName)
    .query(({ ctx, input }) => {
      return ctx.db.social.findUnique({
        where: { screenName: input },
        include: {
          avatars: {
            where: { isPrivate: false },
            include: { user: true },
          },
          administrator: true,
        },
      });
    }),

  update: protectedProcedure
    .input(UpdateSocial)
    .mutation(async ({ ctx, input }) => {
      const social = await ctx.db.social.findUnique({
        where: { id: input.id },
        select: { administratorId: true },
      });
      if (social === null) throw new Error("ソーシャルが見つかりません");
      if (social.administratorId !== ctx.session.user.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      const screenNameExists = await ctx.db.social.findFirst({
        where: { screenName: input.screenName },
      });
      if (screenNameExists !== null && screenNameExists.id !== input.id)
        throw new Error("このIDはすでに使われています");
      return ctx.db.social.update({
        data: {
          screenName: input.screenName,
          isPrivate: input.isPrivate,
          name: input.name,
          image: input.image,
          description: input.description,
          url: input.url,
        },
        where: { id: input.id },
      });
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const social = await ctx.db.social.findUnique({
        where: { id: input },
        select: { administratorId: true },
      });
      if (social === null) throw new Error("ソーシャルが見つかりません");
      if (social.administratorId !== ctx.session.user.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      return ctx.db.social.delete({
        where: { id: input },
      });
    }),
});
