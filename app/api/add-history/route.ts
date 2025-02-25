import { connectMongo } from "@/lib/mongodb";
import { HistoryModel } from "@/schema/history";
import { UserModel } from "@/schema/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: {
    users: Array<{ email: String; percentage: Number }>;
    initiator: string;
    amount: Number;
  } = await req.json();
  try {
    await connectMongo();

    const historyTx: Array<{ user: any; split: Number }> = [];

    const addHistory = async ({
      email,
      percentage,
    }: {
      email: String;
      percentage: Number;
    }) => {
      const { _id } = await UserModel.findOne({ email }, "-password");
      const obj = { user: await _id, split: percentage };
      historyTx.push(obj);
    };

    for (let i = 0; i < body.users.length; i++) {
      await addHistory(body.users[i]);
    }

    const mongoId = await UserModel.findOne({ email: body.initiator });

    const newHistory = new HistoryModel({
      initiator: mongoId,
      history: historyTx,
      amount: body.amount,
    });

    const { _id: historyId } = await newHistory.save();
    if (historyId) {
      return NextResponse.json({
        error: false,
        message: "Added to history",
      });
    } else {
      return NextResponse.json({
        error: true,
        message: "Error occured",
      });
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      error: true,
      message: "Error occured",
    });
  }
}
