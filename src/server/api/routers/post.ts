import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { CreatePost, UpdatePost } from "~/entities/post";
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

  getFullByCreatedById: publicProcedure
    .input(z.number())
    .query(({ ctx, input }) => {
      return ctx.db.post.findUnique({
        where: { id: input },
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

  getFullAllByCreatedByIds: publicProcedure
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

  getAllByUserId: publicProcedure
    .input(z.string().uuid())
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: { createdBy: { userId: input } },
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

  getFullAllBySocialScreenName: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const social = await ctx.db.social.findUnique({
        where: { screenName: input },
      });
      if (social === null) {
        throw new Error("ソーシャルが存在しません");
      }
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: { createdBy: { socialId: social.id } },
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

  update: protectedProcedure
    .input(UpdatePost)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
      });
      if (post === null) {
        throw new Error("投稿が存在しません");
      }
      const avatar = await ctx.db.avatar.findUnique({
        where: { id: post.createdById },
      });
      if (avatar === null) {
        throw new Error("アバターが存在しません");
      }
      if (ctx.session.user.id !== avatar.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return ctx.db.post.update({
        where: { id: input.id },
        data: { content: input.content },
      });
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input },
      });
      if (post === null) {
        throw new Error("投稿が存在しません");
      }
      const avatar = await ctx.db.avatar.findUnique({
        where: { id: post.createdById },
      });
      if (avatar === null) {
        throw new Error("アバターが存在しません");
      }
      if (ctx.session.user.id !== avatar.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return ctx.db.post.delete({
        where: { id: input },
      });
    }),
});
