import { dbConnect } from "@/lib/dbConnect";
import AssignmentModel from "@/models/Assignment.model";
import DeliveryPartnerModel, { DeliveryPartner } from "@/models/DeliveryPartner.model";
import OrderModel, { Order } from "@/models/Order.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, {params}:{params:{id: string}}){
    await dbConnect();
    try {
        const orderId = params.id;
        if(!orderId) {
            return new NextResponse(
              JSON.stringify({
                success: false,
                message: "Order ID not found.",
              }),
              { status: 404 }
            );
        } 
        const order = await OrderModel.findById<Order>(orderId);
        if(!order) {
            return new NextResponse(
              JSON.stringify({
                success: false,
                message: `Order with ID:${orderId} not found.`,
              }),
              { status: 404 }
            );
        }
        console.log(order)
        const partner = await DeliveryPartnerModel.findOne<DeliveryPartner>({
            status: 'active',
            areas: order.area,
            currentLoad: {$lt: 3},
        });

        if(!partner) {
            await AssignmentModel.create({
              orderId: orderId,
              partnerId: null,
              status: 'failed',
              reason: 'No delivery Partner Found'
            })
            return new NextResponse(
              JSON.stringify({
                success: false,
                message: "No delivery partners available.",
              }),
              { status: 404 }
            );
        }
        console.log(partner)
        order.assignedTo = new mongoose.Types.ObjectId(partner._id);
        order.status = 'assigned';
        await order.save();

        partner.currentLoad = (partner.currentLoad || 0) + 1;
        await partner.save();

        const assignment = new AssignmentModel({
          orderId: orderId,
          partnerId: new mongoose.Types.ObjectId(partner._id),
          status: 'success',
        })
        await assignment.save();

        return new NextResponse(
          JSON.stringify({
            success: true,
            message: `Order Assigned to: ${partner.name}`,
          }),
          { status: 200 }
        );

    } catch (error) {
        console.log('Failed to assign Delivery Partner: ',error);
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Something went wrong, please try again...",
          }),
          { status: 500 }
        );
    }
}