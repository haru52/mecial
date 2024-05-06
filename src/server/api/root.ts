import { avatarRouter } from "~/server/api/routers/avatar";
import { postRouter } from "~/server/api/routers/post";
import { socialRouter } from "~/server/api/routers/social";
import { userRouter } from "~/server/api/routers/user";
import { followsRouter } from "~/server/api/routers/follows";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  avatar: avatarRouter,
  post: postRouter,
  social: socialRouter,
  user: userRouter,
  follows: followsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
