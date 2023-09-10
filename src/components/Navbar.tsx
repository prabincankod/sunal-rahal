import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

const Navbar = () => {
  const session = useSession();
  const userId = session?.data?.user.id;
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
                <AvatarImage src="https://github.com/prabincankod.png" />
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-3">
              <DropdownMenuLabel>
                {" "}
                Logged in as {session.data.user.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
