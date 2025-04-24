import mongoose, { Document, Schema, Types } from "mongoose";
import { DeliveryPartner } from "./DeliveryPartner.model";

export interface Order extends Document {
    _id: string;
    customer: {
        name: string;
        phone: string;
        address: string;
    };
    area: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    status: 'pending' | 'assigned' | 'picked' | 'delivered' | 'cancelled';
    scheduledFor: string;
    assignedTo: Types.ObjectId | DeliveryPartner;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

const customerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }
})

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true, 
    },
});

const orderSchema = new Schema<Order>({
    customer: customerSchema,
    area: {
        type: String,
        required: true,
    },
    items: [itemSchema],
    status: {
        type: String,
        enum: ['pending','assigned','picked','delivered','cancelled'],
    },
    scheduledFor: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'DeliveryPartner',
    },
    totalAmount: {
        type: Number,
        required: true,
    },
},{timestamps: true,})

const OrderModel = mongoose.models.Order || mongoose.model<Order>('Order',orderSchema);
export default OrderModel;