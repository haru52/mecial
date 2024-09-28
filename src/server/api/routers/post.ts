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

  getFullyById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
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
      if (post === null) throw new TRPCError({ code: "NOT_FOUND" });
      const belongsTo = await (async () => {
        if (ctx.session === null) return false;

        const avatar = await ctx.db.avatar.findFirst({
          where: {
            userId: ctx.session.user.id,
            socialId: post.createdBy.socialId,
          },
        });
        return avatar !== null;
      })();
      if (post.createdBy.social.isPrivate && !belongsTo) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return post;
    }),

  getAllFullyByCreatedByIds: publicProcedure
    .input(z.array(z.string().uuid()))
    .query(async ({ ctx, input }) => {
      const createdBies = await ctx.db.avatar.findMany({
        where: {
          id: { in: input },
        },
        include: {
          social: true,
        },
      });
      const avatars =
        ctx.session === null
          ? []
          : await ctx.db.avatar.findMany({
              select: { socialId: true },
              where: { userId: ctx.session.user.id },
            });
      const filteredCreatedBies =
        avatars.length === 0
          ? createdBies.filter((createdBy) => !createdBy.social.isPrivate)
          : createdBies.filter((createdBy) => {
              return (
                !createdBy.social.isPrivate ||
                avatars.some((avatar) => avatar.socialId === createdBy.socialId)
              );
            });
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          createdBy: {
            id: { in: filteredCreatedBies.map((createdBy) => createdBy.id) },
          },
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

  getAllByUserId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const socialIds = await (async () => {
        const avatars =
          ctx.session === null
            ? null
            : await ctx.db.avatar.findMany({
                select: { socialId: true },
                where: { userId: ctx.session.user.id },
              });
        return avatars === null ? [] : avatars.map((avatar) => avatar.socialId);
      })();
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          createdBy: { userId: input },
          OR: [
            { createdBy: { social: { isPrivate: false } } },
            { createdBy: { socialId: { in: socialIds } } },
          ],
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

  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const avatars =
      ctx.session === null
        ? []
        : await ctx.db.avatar.findMany({
            select: { socialId: true, social: { select: { isPrivate: true } } },
            where: { userId: ctx.session.user.id },
          });
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        content: { contains: input, mode: "insensitive" },
        OR: [
          { createdBy: { social: { isPrivate: false } } },
          {
            createdBy: {
              socialId: { in: avatars.map((avatar) => avatar.socialId) },
            },
          },
        ],
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

  searchInCurrentSocial: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        select: {
          currentSocialId: true,
          avatars: {
            select: { socialId: true },
          },
        },
        where: { id: ctx.session.user.id },
      });
      if (user === null) throw new TRPCError({ code: "UNAUTHORIZED" });
      const socialIds = user.avatars.map((avatar) => avatar.socialId);

      return user.currentSocialId == null
        ? ctx.db.post.findMany({
            orderBy: { createdAt: "desc" },
            where: {
              content: {
                contains: input,
                mode: "insensitive",
              },
              OR: [
                { createdBy: { social: { isPrivate: false } } },
                {
                  createdBy: {
                    socialId: { in: socialIds },
                  },
                },
              ],
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
              OR: [
                { createdBy: { social: { isPrivate: false } } },
                { createdBy: { socialId: { in: socialIds } } },
              ],
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

  getAllFullyBySocialScreenName: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const social = await ctx.db.social.findUnique({
        select: { id: true, isPrivate: true },
        where: { screenName: input },
      });
      if (social === null) {
        throw new Error("ソーシャルが存在しません");
      }

      const avatar =
        ctx.session === null
          ? null
          : await ctx.db.avatar.findFirst({
              select: { id: true },
              where: { userId: ctx.session.user.id, socialId: social.id },
            });
      if (social.isPrivate && avatar === null) {
        throw new TRPCError({ code: "FORBIDDEN" });
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
