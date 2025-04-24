import mongoose, { Schema } from "mongoose";
import { Document, Types } from "mongoose";

export interface Assignment extends Document {
  orderId: Types.ObjectId;
  partnerId?: Types.ObjectId;
  timestamp: Date;
  status: 'success' | 'failed';
  reason?: string;
}


const assignmentSchema = new Schema<Assignment>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  partnerId: {
    type: Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true,
  },
  reason: {
    type: String,
  },
});

const AssignmentModel =
  mongoose.models.Assignment ||
  mongoose.model<Assignment>('Assignment', assignmentSchema);

export default AssignmentModel;
