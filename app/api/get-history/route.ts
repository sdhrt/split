import { connectMongo } from "@/lib/mongodb";
import { HistoryModel } from "@/schema/history";
import { UserModel } from "@/schema/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username } = await req.json();
  await connectMongo();

  const { _id } = await UserModel.findOne({ username });

  const history = await HistoryModel.find({ initiator: _id });

  return NextResponse.json({
    history: history,
  });
}
