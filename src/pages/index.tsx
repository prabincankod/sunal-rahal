import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { LogInIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const getUsername = api.example.getUserName.useQuery(undefined, {
    enabled: sessionData?.user.id ? true : false,
  });
  useEffect(() => {
    sessionData?.user.id &&
      toast.success(`Logged In as ${sessionData.user?.name}`);
  }, [sessionData?.user.id]);
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

      <div className="flex flex-col items-center text-center ">
        <div className="flex items-center text-center">
          <h1 className="bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]  from-violet-600 via-violet-500 to-violet-200  bg-clip-text text-5xl font-bold text-transparent">
            Your Spotify Visualized
          </h1>
        </div>

        <p className="mt-2 max-w-xl text-lg text-slate-600 ">
          Join Now and Beautifully showcase your currently playing tracks
          through SVG cards on Github.
        </p>

        {!sessionData?.user.id && (
          <div className="mt-3 flex items-center text-center ">
            <Button
              onClick={() => {
                void signIn("spotify");
              }}
            >
              Login Via Spotify <LogInIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        <div className=" mt-3 min-w-full  max-w-full rounded-md border-2 border-dashed  border-stone-400 bg-white  p-1">
          <img
            className=" min-w-full max-w-full   rounded-lg "
            src={`https://sunal-rahal.vercel.app/api/getWhatsPlaying/${
              sessionData?.user.id
                ? getUsername.data?.data
                  ? getUsername.data.data
                  : "prabincankod"
                : "prabincankod"
            }`}
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Home;
