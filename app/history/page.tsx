import { connectMongo } from "@/lib/mongodb";
import { HistoryModel } from "@/schema/history";
import { UserModel } from "@/schema/user";
import { currentUser } from "@clerk/nextjs/server";
import { Link } from "next-view-transitions";
import { redirect } from "next/navigation";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }
  await connectMongo();
  const { _id } = await UserModel.findOne({ username: user?.username });
  const userHistory = await HistoryModel.find({ initiator: _id });

  async function getUser(userid: string): Promise<string> {
    const { username } = await UserModel.findById(userid, "username");
    return username.toString();
  }

  return (
    <div className="flex flex-col items-center my-4 gap-4">
      <div className="py-4 text-2xl font-semibold">History</div>
      <Link className="text-blue-500 underline underline-offset-2" href={"/"}>
        Go home
      </Link>
      {userHistory &&
        userHistory.map((h, i) => {
          return (
            <div
              key={`${i}${h._id.toString()}`}
              className="p-4 border rounded-sm w-full max-w-xl"
            >
              <div className="font-semibold text-lg">
                Total amount: {h.amount}
              </div>
              <div>
                {h.history.map((hist: any) => {
                  return (
                    <div key={`${hist.user.toString()}`} className="flex gap-2">
                      <span>{getUser(hist.user.toString())}</span>
                      <span>{hist.split}%</span>
                      <span>{(hist.split / 100) * h.amount}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      {userHistory.length === 0 && (
        <div className="text-xl">No history found. </div>
      )}
    </div>
  );
}

export default page;
