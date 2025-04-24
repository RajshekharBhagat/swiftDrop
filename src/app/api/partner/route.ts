import { dbConnect } from '@/lib/dbConnect';
import DeliveryPartnerModel from '@/models/DeliveryPartner.model';
import { partnerSchema } from '@/schema/partner.schema';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const partners = await DeliveryPartnerModel.find();
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Partners Found!.",
        data: partners,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log('Error fetching Partners: ',error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Something went wrong.",
      }),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsedData = partnerSchema.safeParse(body);
    if(!parsedData.success){
      console.log(parsedData.error.errors);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid Input",
        }),
        { status: 422 }
      );
    }
    const validatedData = parsedData.data
    const existingPartnerWithEmail = await DeliveryPartnerModel.findOne({email:validatedData.email});
    if(existingPartnerWithEmail) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Partner with this email already exist.",
        }),
        { status: 409 }
      );
    }
    const newPartner = new DeliveryPartnerModel(validatedData);
    newPartner.currentLoad = 0;
    const savedPartner = await newPartner.save();
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Partner Created Successfully.",
      }),
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error)
    if(error instanceof ZodError) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Partner Validation Failed.",
        }),
        { status: 422 }
      );
    }
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Something went wrong.",
      }),
      { status: 500 }
    );
  }
}
