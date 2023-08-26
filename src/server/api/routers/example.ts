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
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
