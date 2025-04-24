import { dbConnect } from "@/lib/dbConnect";
import DeliveryPartnerModel from "@/models/DeliveryPartner.model";
import OrderModel from "@/models/Order.model";
import { orderStatusToggleValidator } from "@/validators/orderStatusToggleValidator";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  try {
    const body = await req.json();
    const {id: orderId} = await context.params;
    if (!orderId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Order ID not found.",
        }),
        { status: 404 }
      );
    }
    const parsedBody = orderStatusToggleValidator.safeParse(body);
    if (!parsedBody.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message:
            parsedBody.error.errors.map((err) => err.message).join(",") ||
            "Order Status Validation Failed",
        }),
        { status: 200 }
      );
    }
    const newStatus = parsedBody.data.status;

    const order = await OrderModel.findById(orderId);
    if(!order) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Order not found.",
        }),
        { status: 404 }
      );
    }
    const prevStatus = order.status;
    order.status = newStatus;
    await order.save();

    if((newStatus === 'delivered' || newStatus === 'cancelled') && prevStatus !==newStatus) {
      if( order.assignedTo) {
        const partner = await DeliveryPartnerModel.findById(order.assignedTo);
        if(partner) {
          partner.currentLoad = Math.max((partner.currentLoad || 1) - 1, 0);
          await partner.save();
        }
      }
    }
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Order Updated.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update  order status: ", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Something went wrong.",
      }),
      { status: 500 }
    );
  }
}
