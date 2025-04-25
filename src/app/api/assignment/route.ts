import { dbConnect } from "@/lib/dbConnect";
import AssignmentModel from "@/models/Assignment.model";
import "@/models/DeliveryPartner.model";
import "@/models/Order.model"
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    await dbConnect();
    try {
        const assignment = await AssignmentModel.find().populate('partnerId').populate('orderId');
        if(!assignment) {
            return new NextResponse(
              JSON.stringify({
                success: false,
                message: "Assignment Details not found.",
              }),
              { status: 404 }
            );
        }
        return new NextResponse(
          JSON.stringify({
            success: true,
            message: "Assignment Details Found.",
            data: assignment,
          }),
          { status: 200 }
        );              
    } catch (error) {
        console.log("Failed to get Assignment Details: ", error);
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Something went wrong, Please try again...",
          }),
          { status: 500 }
        );
    }
}