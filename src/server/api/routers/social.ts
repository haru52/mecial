import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { CreateSocial } from "~/entities/social";
import { ScreenName } from "~/zod/zodSchemas";

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

  getByScreenNameWithAvatarUsers: publicProcedure
    .input(ScreenName)
    .query(({ ctx, input }) => {
      return ctx.db.social.findFirst({
        where: { screenName: input },
        include: {
          avatars: {
            where: { isPrivate: false },
            include: { user: true },
          },
        },
      });
    }),
});
