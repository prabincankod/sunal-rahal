import { env } from "~/env.mjs";

import axios, { AxiosResponse } from "axios";
const client_id = env.DISCORD_CLIENT_ID;
const client_secret = env.DISCORD_CLIENT_SECRET;
const basicToken = Buffer.from(`${client_id}:${client_secret}`).toString(
  "base64"
);

const generateAccessToken = async (refreshToken: String) => {
  try {
    console.log({ refreshToken: refreshToken, basicToken });
    const response: AxiosResponse = await axios(
      "https://accounts.spotify.com/api/token",
      {
        params: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        },
        method: "POST",
        headers: {
          Authorization: `Basic ${basicToken}`,
        },
      }
    );
    return response.data.access_token;
  } catch (e: any) {
    console.log(e.cause?.message);
  }
};

export { generateAccessToken };
