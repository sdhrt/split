import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

async function LoginPage() {
  const { userId } = await auth();

  if (userId) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-5">
        Server Error
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-5">
      <span className="text-2xl font-black">Login to use the application</span>
      <div>
        <Button variant={"outline"} asChild>
          <SignInButton />
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
