import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { CreateSocial, UpdateSocial } from "~/entities/social";
import { ScreenName } from "~/zod/zod-schemas";

export const socialRouter = createTRPCRouter({
  create: protectedProcedure.input(CreateSocial).mutation(({ ctx, input }) => {
    return ctx.db.social.create({
      data: {
        screenName: input.screenName,
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

  update: protectedProcedure.input(UpdateSocial).mutation(({ ctx, input }) => {
    return ctx.db.social.update({
      data: {
        screenName: input.screenName,
        name: input.name,
        image: input.image,
        description: input.description,
        url: input.url,
      },
      where: { id: input.id },
    });
  }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.social.delete({
      where: { id: input },
    });
  }),
});
