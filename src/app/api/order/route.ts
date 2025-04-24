import { dbConnect } from "@/lib/dbConnect";
import "@/models/DeliveryPartner.model";
import OrderModel from "@/models/Order.model";
import { orderSchema } from "@/schema/order.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";


export  async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const orderList = await OrderModel.find().populate('assignedTo');
        return new NextResponse(
          JSON.stringify({
            success: true,
            data: orderList,
          }),
          { status: 200 }
        );
    } catch (error) {
        console.log('Failed to get order list: ',error);
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Something went wrong.",
          }),
          { status: 500 }
        );
    }
}

export async function POST(req:NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const parsedBody = orderSchema.safeParse(body);
        if(!parsedBody.success) {
            return new NextResponse(
              JSON.stringify({
                success: false,
                message: "Invalid Input",
              }),
              { status: 422 }
            );
        }
        const orderData = parsedBody.data;
        console.log(orderData)
        const order = new OrderModel(orderData);
        await order.save();
        return new NextResponse(
          JSON.stringify({
            success: true,
            message: "Order Created.",
          }),
          { status: 201 }
        );      
    } catch (error) {
        console.log('Failed to create order: ', error);
        if(error instanceof ZodError) {
            return new NextResponse(
              JSON.stringify({
                success: false,
                message: error.errors[0],
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