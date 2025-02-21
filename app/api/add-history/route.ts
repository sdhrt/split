import { connectMongo } from "@/lib/mongodb";
import { HistoryModel } from "@/schema/history";
import { UserModel } from "@/schema/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: {
    users: Array<{ name: String; percentage: Number }>;
    initiator: string;
    amount: Number;
  } = await req.json();
  try {
    await connectMongo();

    const historyTx: Array<{ user: any; split: Number }> = [];

    const addHistory = async ({
      name,
      percentage,
    }: {
      name: String;
      percentage: Number;
    }) => {
      const { _id } = await UserModel.findOne({ username: name }, "-password");
      const obj = { user: await _id, split: percentage };
      historyTx.push(obj);
    };

    for (let i = 0; i < body.users.length; i++) {
      await addHistory(body.users[i]);
    }

    const { _id } = await UserModel.findOne({ username: body.initiator });

    const newHistory = new HistoryModel({
      initiator: _id,
      history: historyTx,
      amount: body.amount,
    });

    // const duplicateHistory = await HistoryModel.findOne({
    //   initiator: _id,
    //   history: historyTx,
    // });
    // console.log(`duplicateHistory:::::${duplicateHistory}`);
    //
    // return NextResponse.json({
    //   error: false,
    //   message: "Added to history",
    // });
    //
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
    return NextResponse.json({
      error: true,
      message: "Error occured",
    });
  }
}
