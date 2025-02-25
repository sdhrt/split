import { connectMongo } from "@/lib/mongodb";
import { UserModel } from "@/schema/user";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    const client = await clerkClient();
    await connectMongo();

    const hashedPass = await bcrypt.hash(password, 10);

    const mongoUser = await UserModel.findOne({ email });

    if (mongoUser) {
      return NextResponse.json({
        error: "User already exists",
      });
    }

    const newUser = new UserModel({
      email,
      password: hashedPass,
    });

    const { _id } = await newUser.save();
    const { id } = await client.users.createUser({
      emailAddress: [email],
      password: password,
    });

    if (!id) {
      console.log("deleted mongodb user");
      await UserModel.findByIdAndDelete(_id);
    }

    return NextResponse.json({
      error: null,
    });
  } catch (error: any) {
    console.log("error", error);
    console.error(error);
    console.log(error.errors);
    return NextResponse.json({
      error: "Server error",
    });
  }
}
