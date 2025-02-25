import { connectMongo } from "@/lib/mongodb";
import { UserModel } from "@/schema/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userid } = await req.json();
    await connectMongo();

    const { email } = await UserModel.findById(userid, "email");

    return NextResponse.json({
      email: email,
    });
  } catch (error) {
    return NextResponse.json({
      email: null,
    });
  }
}
