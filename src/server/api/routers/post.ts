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
});
