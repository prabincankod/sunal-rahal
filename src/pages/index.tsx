import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const getWhatsPlaying = api.example.getWhatsPlaying.useQuery(
    undefined, // no input
    { enabled: true }
  );

  const { data } = api.example.getUserName.useQuery();
  const [localUsername, setLocalUsername] = useState(data?.data);

  const mutateUsername = api.example.setUserName.useMutation();
  useEffect(() => {
    setLocalUsername(data?.data);
  }, [data]);

  const setUserName = () => {
    const newUsername = localUsername;
    mutateUsername.mutate({ newUserName: `${newUsername}` });
  };
  return (
    <>
      <Head>
        <title>Sunal Rahal </title>
        <meta
          name="description"
          content="Elevate your music experience with Sunal Rahal: a web app that syncs with Spotify to display your current tracks. Log in effortlessly, groove to your tunes, and share your now-playing through stylish SVG cards. Your music, reimagined."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-green-500">
        <h1 className="mb-8 text-5xl font-semibold text-white">Sunal Rahal</h1>
        <div className="flex flex-col items-center rounded-lg bg-green-700 p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Elevate Your Github Experience
          </h2>
          {typeof data?.data === "string" && (
            <form onSubmit={setUserName} className="flex items-center">
              <input
                value={`${localUsername}`}
                className="focus:border-cyan rounded-l border border-green-600 bg-green-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring"
                onChange={(e) => setLocalUsername(e.target.value)}
                placeholder="Enter your username"
              />

              <button
                type="submit"
                className="rounded-r bg-green-500 px-4 py-2 text-white hover:bg-green-700 focus:border-green-700 focus:outline-none focus:ring"
              >
                Submit
              </button>
            </form>
          )}

          <p className="mb-6 text-center text-white">
            {getWhatsPlaying.data?.data ? (
              <>
                {getWhatsPlaying.data?.data?.item.name} by{" "}
                {getWhatsPlaying.data?.data?.item.artists[0]?.name}
              </>
            ) : (
              "Nothing is playing currently"
            )}
          </p>
          <button
            onClick={() => getWhatsPlaying.refetch()}
            className="rounded-full bg-white px-6 py-3 font-semibold text-green-500 transition duration-300 hover:bg-green-100"
          >
            Get Whats Playin
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
