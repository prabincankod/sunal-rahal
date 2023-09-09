import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const session = useSession();
  const userId = session?.data?.user.id;
  return (
    <nav className="flex items-center justify-between bg-green-500 p-4">
      <div className="text-lg font-semibold text-white">
        Sunal
        <span className="text"> Rahal</span>
      </div>
      {userId ? (
        <div className="text-lg font-semibold text-white">
          <span className="text"> Logged In as {session.data.user.name}</span>
          <button
            className="rounded bg-green-700 px-4 py-2 text-white"
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="text-lg font-semibold text-white">
          <button
            className="rounded bg-green-700 px-4 py-2 text-white"
            onClick={() => {
              signIn();
            }}
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
