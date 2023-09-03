import axios, { AxiosError, AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { generateAccessToken } from "~/server/utils/generateAccessToken";
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
  const getDataUri = async (url: any) => {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data, "binary").toString("base64");
    return `data:image/png;base64,${buffer}`;
  };

  console.log(response.data === "");

  // res.send(response.data === "" ? "<h1>gend fatt gayil</h1>" : spotifyResponse);
  // res.status(200).json({ "account": user?.accounts[0] });
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
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2242" height="806" viewBox="0 0 2242 806" fill="none">
      <rect x="10.5" y="10.5" width="2221" height="785" rx="60.5" fill="#EF5DA8" stroke="#14FF0F" stroke-width="21"/>
      <text fill="white" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="100" font-weight="800" letter-spacing="0em"><tspan x="1181" y="499.864">${
        spotifyResponse.item.artists[0]?.name
      }</tspan></text>
      <text fill="white" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="100" font-weight="800" letter-spacing="0em"><tspan x="823" y="314.864">${
        spotifyResponse.item.name
      }</tspan></text>
      <circle cx="375" cy="403" r="288" fill="url(#pattern0)"/>
      <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlink:href="#image0_3_17" transform="scale(0.00333333)"/>
      </pattern>
      <image id="image0_3_17" width="300" height="300" href="${await getDataUri(
        spotifyResponse.item.album?.images[0]?.url
      )}"/>
      </defs>
      </svg>

`);
};

export default handler;
