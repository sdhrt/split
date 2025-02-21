import { auth } from "@clerk/nextjs/server";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ExpenseSplitCard from "./_components/SplitCard";

async function Home() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <div>
      <SignedOut></SignedOut>
      <SignedIn>
        <div className="flex justify-center items-center h-screen">
          <ExpenseSplitCard />
        </div>
      </SignedIn>
    </div>
  );
}

export default Home;
