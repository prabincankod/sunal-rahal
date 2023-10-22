import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AuthProvider from "~/components/AuthProvider";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

const Profile = () => {
  const session = useSession();
  const getUsername = api.example.getUserName.useQuery(undefined, {
    enabled: session.status === "authenticated" ? true : false,
  });

  const mutateUsername = api.example.setUserName.useMutation();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const newUsername = getUsername.data?.data;
    newUsername && setUsername(newUsername);
  }, [getUsername.data?.data]);

  return (
    <AuthProvider>
      <Card>
        <CardHeader>
          <CardTitle>Set Username</CardTitle>
          <CardDescription>Get yourself a username.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-x-2 flex-col gap-y-2 md:flex-row items-center ">
            <Input
              placeholder="@username"
              className="text-center"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Button
              size={"default"}
              onClick={async () => {
                await mutateUsername.mutateAsync({ newUserName: username });
                toast.success("Username Updated Successfully");
              }}
            >
              {mutateUsername.isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthProvider>
  );
};
export default Profile;
