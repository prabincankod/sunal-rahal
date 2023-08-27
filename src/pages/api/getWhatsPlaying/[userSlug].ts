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

  console.log(response.data === "");

  // res.send(response.data === "" ? "<h1>gend fatt gayil</h1>" : spotifyResponse);
  // res.status(200).json({ "account": user?.accounts[0] });
  res.setHeader("Content-Type", "image/svg+xml");
  response.data === ""
    ? res.send(`
    //   <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">

    //   <!-- Background -->
    //   <rect width="100%" height="100%" fill="#1DB954" />

    //   <!-- Spotify Card Logo -->
    //   <svg x="160" y="20" width="80" height="80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    //     <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    //   </svg>

    //   <!-- Text -->
    //   <text x="200" y="230" font-family="Arial" font-size="16" fill="white" text-anchor="middle">Not playing anything</text>

    // </svg>
    //

    <svg width="600" height="150" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="100%" height="100%" fill="#1DB954" />

      <!-- Text -->
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
        Currently Listening to Spotify 🎵
      </text>
    </svg>


`)
    : res.send(`<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">

      <!-- Background -->
      <rect width="100%" height="100%" fill="#1DB954" />

      <!-- Album Cover -->
      <image x="50" y="50" width="300" height="300" href="${spotifyResponse.item.album.images[1]?.url}" />

      <!-- Song Details -->
      <text x="200" y="380" font-family="Arial" font-size="16" fill="white" text-anchor="middle">${spotifyResponse.item.name}</text>
      <text x="200" y="400" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Artist Name</text>

      <!-- Play/Pause Button -->
      <circle cx="200" cy="250" r="40" fill="white" />
      <polygon points="185,230 215,250 185,270" fill="#1DB954" />

      <!-- Spotify Card Logo -->
      <svg x="160" y="300" width="80" height="80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>

    </svg>
`);

  // res.status(200).json({ userSlug });
};

export default handler;
