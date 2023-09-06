import axios, { AxiosError, AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { generateAccessToken } from "~/server/utils/generateAccessToken";
import getDataUri from "~/server/utils/getDataUri";
import { SpotifyResponse } from "~/types/spotify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

  res.setHeader("Content-Type", "image/svg+xml");
  response.data === ""
    ? res.send(`
    <svg width="600" height="150" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="100%" height="100%" fill="#1DB954" />

      <!-- Text -->
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
        Currently Listening Nothing on Spotify 🎵
      </text>
    </svg>
`)
    : res.send(`
    <svg width="600" height="150" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="100%" height="100%" fill="#1DB954" />

    <!-- Text -->
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
    Listening to ${spotifyResponse.item.name} on Spotify 🎵
    </text>
  </svg>
`);
};

export default handler;
