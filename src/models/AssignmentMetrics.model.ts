import mongoose, { Document, Schema } from "mongoose";

export interface AssignmentMetrics extends Document {
  totalAssigned: number;
  successRate: number;
  averageTime: number; 
  failureReasons: {
    reason: string;
    count: number;
  }[];
}


const failureReasonSchema = new Schema({
  reason: { type: String, required: true },
  count: { type: Number, required: true },
});

const assignmentMetricsSchema = new Schema<AssignmentMetrics>({
  totalAssigned: { type: Number, required: true },
  successRate: { type: Number, required: true }, 
  averageTime: { type: Number, required: true }, 
  failureReasons: [failureReasonSchema],
});

const AssignmentMetricsModel =
  mongoose.models.AssignmentMetrics ||
  mongoose.model<AssignmentMetrics>('AssignmentMetrics', assignmentMetricsSchema);

export default AssignmentMetricsModel;
