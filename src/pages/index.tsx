import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "From Sunal Rahal" });

  const getWhatsPlaying = api.example.getWhatsPlaying.useQuery(
    undefined, // no input
    { enabled: true }
  );

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
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Sunal <span className="text-[hsl(280,100%,70%)]">Rahal</span>
          </h1>
          <div className="grid grid-cols-1 gap-4  md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className=" text-center text-2xl font-bold">What am I listenin?</h3>
              <div className="text-lg text-center">
                I can listen any thing from bo burnham to tim minchin
              </div>
            </Link>

          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main > */}
      <div className="flex min-h-screen flex-col items-center justify-center bg-green-500">
        <h1 className="mb-8 text-5xl font-semibold text-white">Sunal Rahal</h1>
        <div className="flex flex-col items-center rounded-lg bg-green-700 p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Elevate Your Github Experience
          </h2>
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

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const getWhatsPlaying = api.example.getWhatsPlaying.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
        {getWhatsPlaying.data?.data?.item.name} by{" "}
        {getWhatsPlaying.data?.data?.item.artists[0]?.name}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
