import { connectMongo } from "@/lib/mongodb";
import { HistoryModel } from "@/schema/history";
import { UserModel } from "@/schema/user";
import { currentUser } from "@clerk/nextjs/server";
import { Link } from "next-view-transitions";
import { redirect } from "next/navigation";
import Chart from "./_components/Chart";
import { HomeIcon } from "lucide-react";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }
  await connectMongo();
  const { _id } = await UserModel.findOne({
    email: user?.primaryEmailAddress?.emailAddress,
  });
  const userHistory = await HistoryModel.find({ initiator: _id }).sort({
    createdAt: -1,
  });

  return (
    <div className="flex flex-col items-center my-4 gap-2">
      <div className="text-2xl font-semibold">History</div>
      <Link
        className="text-blue-500 underline underline-offset-2 flex gap-1 items-center"
        href={"/"}
      >
        <HomeIcon size={18} />
        Go home
      </Link>
      {userHistory && <Chart userHistory={JSON.stringify(userHistory)} />}
      {userHistory.length === 0 && (
        <div className="text-xl">No history found. </div>
      )}
    </div>
  );
}

export default page;
