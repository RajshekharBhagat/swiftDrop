import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { SignUpSchema } from "@/schema/sign-up.schema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req:NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const safeParsed = SignUpSchema.safeParse(body);
        if(!safeParsed.success) {
            return new NextResponse(
              JSON.stringify({
                success: false,
                message: "Invalid Input",
              }),
              { status: 400 }
            );
        }
        
        const {email, password} = safeParsed.data;

        const existingUser = await UserModel.findOne({email});
        if(existingUser) {
            return new NextResponse(
              JSON.stringify({
                success: false,
                message: "User with this email already exist.",
              }),
              { status: 409 }
            );
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new UserModel({
            email: email,
            password: hashedPassword,
        });
        await user.save();
        return new NextResponse(
          JSON.stringify({
            success: true,
            message: "User Created",
          }),
          { status: 201 }
        );
    } catch (error) {
      if(error instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: error.errors,
          }),
          { status: 422}
        );
      }
        console.log('Error creating new user: ',error)
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Something went wrong.",
          }),
          { status: 500 }
        );
    }
}