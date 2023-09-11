import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { LogInIcon, Music, LogOutIcon, User, PlayCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/router";
import { getInitials } from "~/lib/utils";
import { api } from "~/utils/api";

const Navbar = () => {
  const session = useSession();
  const userId = session?.data?.user.id;
  const router = useRouter();
  const getWhatsPlaying = api.example.getWhatsPlaying.useQuery(undefined, {
    enabled: session.data?.user.id ? true : false,
  });
  return (
    <nav className="flex items-center justify-between  p-4">
      <div className="text-lg font-semibold">
        Sunal
        <span className="text"> Rahal</span>
      </div>
      {userId && (
        <div className="mr-4 text-lg font-semibold">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                {session.data.user.image ? (
                  <AvatarImage src={session.data.user?.image} />
                ) : (
                  <AvatarFallback>
                    {getInitials(`${session.data.user?.name}`)}
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-3">
              <DropdownMenuLabel>
                Logged in as {session.data.user.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  router.push("/profile");
                }}
              >
                <User className="mr-2 h-5 w-5 " />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                }}
              >
                <LogOutIcon className="mr-2 h-5 w-5 " /> <span>Logout</span>
              </DropdownMenuItem>

              {session.data.user.id && getWhatsPlaying.data?.data && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>
                    {!getWhatsPlaying.data.data.item.name ? (
                      "Pay For Spotify"
                    ) : (
                      <div className="flex items-center ">
                        <PlayCircle
                          className={`${
                            getWhatsPlaying.data.data.is_playing
                              ? "animate-spin"
                              : ""
                          }  mr-2 h-4 w-4`}
                        />
                        {getWhatsPlaying.data.data.item.name}
                      </div>
                    )}
                  </DropdownMenuLabel>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
