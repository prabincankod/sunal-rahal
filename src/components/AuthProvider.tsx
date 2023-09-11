import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    session.status === "unauthenticated" && router.push("/");
  }, [session.status]);
  return (
    <>
      {session.status === "loading" ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        children
      )}
    </>
  );
};

export default AuthProvider;
