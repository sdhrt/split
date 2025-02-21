import { connectMongo } from "@/lib/mongodb";
import { UserModel } from "@/schema/user";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  try {
    const client = await clerkClient();
    await connectMongo();

    const mongoUser = await UserModel.findOne({ username });

    if (mongoUser) {
      return NextResponse.json({
        error: "User already exists",
      });
    }

    const newUser = new UserModel({
      username,
      password,
    });

    const { username: u } = await newUser.save();
    await client.users.createUser({
      username: u,
      password: password,
    });

    // const { id: i } = await client.users.deleteUser(id);
    // if (i) {
    //   console.log("deleted from clerk");
    // }
    //
    // const { acknowledged } = await UserModel.deleteOne({ username });
    // if (acknowledged) {
    //   console.log("deleted from mongodb");
    // }

    return NextResponse.json({
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: "Server error",
    });
  }
}
