import axios, { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { generateAccessToken } from "~/server/utils/generateAccessToken";
import { SpotifyResponse } from "~/types/spotify";

export const exampleRouter = createTRPCRouter({
  getWhatsPlaying: protectedProcedure.query(async ({ ctx }) => {
    const userAccount = await ctx.prisma.account.findFirst({
      where: { userId: ctx.session.user.id },
    });

    const accessToken = userAccount?.access_token;
    const refreshToken = userAccount?.refresh_token;

    const response: AxiosResponse = await axios
      .get("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .catch(async (e: AxiosError) => {
        e.response?.statusText === "Unauthorized" &&
          (await ctx.prisma.account.update({
            where: { id: userAccount?.id },
            // @ts-ignore
            data: { access_token: await generateAccessToken(refreshToken) },
          }));
        return response;
      });
    if (response.data === "")
      return { message: "No song is currently playing", data: null };

    const data: SpotifyResponse = response?.data;
    return { data, message: "playing" };
  }),

  setUserName: protectedProcedure
    .input(z.object({ newUserName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { username: input.newUserName },
      });
      return { message: "username set successfully " };
    }),
  getUserName: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.account.findFirst({
      where: { userId: ctx.session.user.id },
      include: { user: true },
    });

    const username = user?.user.username;
    console.log(user);

    return { message: "success", data: username };
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
