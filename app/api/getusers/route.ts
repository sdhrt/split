import { connectMongo } from "@/lib/mongodb";
import { UserModel } from "@/schema/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  await connectMongo();

  const users = await UserModel.find(
    {
      email: new RegExp(email, "i"),
    },
    "email , _id",
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
