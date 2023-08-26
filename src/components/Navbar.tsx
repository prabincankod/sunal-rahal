import { signIn, signOut, useSession } from "next-auth/react"

const Navbar = () => {
  const session = useSession()
  const userId = session?.data?.user.id
  return (
    <nav className="bg-green-500 p-4 flex justify-between items-center">
      <div className="text-white font-semibold text-lg">Sunal
        <span className="text"> Rahal</span>
      </div>
      {userId ? (
        <div className="text-white font-semibold text-lg">
          <span className="text"> Logged In as {session.data.user.name}</span>
          {/* profile avatar card */}
          {/* <div className="flex items-center">
            <img src={session.data.user.image} alt="profile" className="w-10 h-10 rounded-full" />
            <span className="text"> {session.data.user.name}</span>
          </div> */}

          {/* sign out button */}

          <button className="bg-green-700 text-white px-4 py-2 rounded" onClick={() => { signOut() }}>Sign Out</button>
        </div>
      ) : (
        <div className="text-white font-semibold text-lg">
          <button className="bg-green-700 text-white px-4 py-2 rounded" onClick={() => { signIn() }}>Sign In</button>
        </div>
      )
      }

    </nav >)
}


export default Navbar
