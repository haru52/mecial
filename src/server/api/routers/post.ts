import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { CreatePost } from "~/entities/post";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreatePost)
    .mutation(async ({ ctx, input }) => {
      const avatar = await ctx.db.avatar.findUnique({
        where: { id: input.createdById },
      });
      if (avatar === null) {
        throw new Error("アバターが存在しません");
      }
      if (ctx.session.user.id !== avatar.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return ctx.db.post.create({
        data: {
          content: input.content,
          createdBy: { connect: { id: input.createdById } },
        },
      });
    }),

  getAllByCreatedById: publicProcedure
    .input(z.string().uuid())
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: { createdBy: { id: input } },
      });
    }),

  getAllByCreatedByIdsWithCreatedByUser: publicProcedure
    .input(z.array(z.string().uuid()))
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: { createdBy: { id: { in: input } } },
        include: {
          createdBy: {
            include: {
              social: true,
              user: true,
            },
          },
        },
      });
    }),

  search: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { content: { contains: input, mode: "insensitive" } },
      include: {
        createdBy: {
          include: {
            social: true,
            user: true,
          },
        },
      },
    });
  }),

  searchInCurrentSocial: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      return user?.currentSocialId == null
        ? ctx.db.post.findMany({
            orderBy: { createdAt: "desc" },
            where: {
              content: { contains: input, mode: "insensitive" },
            },
            include: {
              createdBy: {
                include: {
                  social: true,
                  user: true,
                },
              },
            },
          })
        : ctx.db.post.findMany({
            orderBy: { createdAt: "desc" },
            where: {
              content: { contains: input, mode: "insensitive" },
              createdBy: { socialId: user.currentSocialId },
            },
            include: {
              createdBy: {
                include: {
                  social: true,
                  user: true,
                },
              },
            },
          });
    }),
});
