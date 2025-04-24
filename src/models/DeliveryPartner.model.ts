import mongoose, { Document, Schema } from "mongoose";

export interface DeliveryPartner extends Document {
    _id: string,
    name: string,
    email: string,
    phone: string,
    status: 'active'|'inactive',
    currentLoad: number,
    areas: string[],
    shift: {
        start: string,
        end: string,
    },
    metrics: {
        rating: number,
        completedOrders: number;
        cancelledOrders: number;
    }
}

const shiftSchema = new Schema({
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true
    },
})

const metricsSchema = new Schema({
    rating: {
        type: Number,
        required: true,
    },
    completedOrders: {
        type: Number,
        required: true,
    },
    cancelledOrders: {
        type: Number,
        required: true,
    }
})

const deliveryPartnerSchema = new Schema<DeliveryPartner>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active','inactive'],
        required: true,
    },
    currentLoad:{
        type: Number,
        max: 3,
        min:0,
    },
    areas: [{
        type: String,
    }],
    shift: shiftSchema,
    metrics: metricsSchema
})

const DeliveryPartnerModel = mongoose.models.DeliveryPartner ||  mongoose.model<DeliveryPartner>('DeliveryPartner',deliveryPartnerSchema);
export default DeliveryPartnerModel