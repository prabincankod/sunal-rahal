import axios, { AxiosError, AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { generateAccessToken } from "~/server/utils/generateAccessToken";
import { SpotifyResponse } from "~/types/spotify";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // get slug from url

  const { userSlug } = req.query;
  if (!userSlug) res.status(400).json({ error: "No user slug provided" });

  const user = await prisma.user.findUnique({
    where: {
      username: userSlug as string,
    },
    include: { accounts: true },
  });
  if (user === null) {
    return res.status(400).json({ error: "No user found" });
  }
  const accessToken = user?.accounts[0]?.access_token;
  const refreshToken = user?.accounts[0]?.refresh_token;

  const response: AxiosResponse = await axios
    .get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch(async (e: AxiosError) => {
      e.response?.statusText === "Unauthorized" &&
        (await prisma.account.update({
          where: { id: user?.accounts[0]?.id },
          // @ts-ignore
          data: { access_token: await generateAccessToken(refreshToken) },
        }));
      return response;
    });

  const spotifyResponse: SpotifyResponse = response.data;

  console.log(response.data === "");

  res.send(response.data === "" ? "<h1>gend fatt gayil</h1>" : spotifyResponse);
  // res.status(200).json({ "account": user?.accounts[0] });

  // res.status(200).json({ userSlug });
};
