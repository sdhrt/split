import { connectMongo } from "@/lib/mongodb";
import { UserModel } from "@/schema/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username } = await req.json();
  await connectMongo();

  const users = await UserModel.find(
    {
      username: new RegExp(username, "i"),
    },
    "username , _id",
  ).exec();

  if (users) {
    return NextResponse.json({
      users: users,
    });
  }

  return NextResponse.json({
    users: null,
  });
}
