import { dbConnect } from "@/lib/dbConnect";
import DeliveryPartnerModel from "@/models/DeliveryPartner.model";
import { partnerSchema } from "@/schema/partner.schema";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest,{params}:{params:{id: string}}) {
    await dbConnect();
    try {
        const partnerId = await params.id
        const body = await req.json();
        const parsedData = partnerSchema.safeParse(body);
        if(!parsedData.success) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "Invalid Input",
               }),
               { status: 422 }
            );
        }
        const updatedData = parsedData.data;
        const updatedUser = await DeliveryPartnerModel.findByIdAndUpdate(
            partnerId,
            updatedData,
            {new: true, runValidators: true},
        );
        if(!updatedUser) {
            return new NextResponse(
              JSON.stringify({
                success: false,
                message: "Partner Not found.",
              }),
              { status: 404 }
            );
        }
        return new NextResponse(
          JSON.stringify({
            success: true,
            message: "Partner's Profile Updated.",
          }),
          { status: 200 }
        );

    } catch (error) {
        console.log('Something went wrong while updating partner: ',error);
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Something went wrong.",
          }),
          { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest,{params}: {params:{id: string}}) {
    await dbConnect();
    try {
        const partnerId = params.id;
        const deletedUser = await DeliveryPartnerModel.findByIdAndDelete(partnerId);
        if(!deletedUser) {
            return new NextResponse(
              JSON.stringify({
                success: false,
                message: "User not found.",
              }),
              { status: 404 }
            );
        }
        return new NextResponse(
          JSON.stringify({
            success: true,
            message: "Partner Deleted.",
          }),
          { status: 200 }
        );
    } catch (error) {
        console.log('Failed to delete partner: ',error);
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Something went wrong.",
          }),
          { status: 500 }
        );
    }
}