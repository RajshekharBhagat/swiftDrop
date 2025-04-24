import { z } from "zod";

export const orderSchema = z.object({
  _id: z.string().optional(),
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(1, "Address is required"),
  }),
  area: z.string().min(1, "Area is required"),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z.number().positive("Quantity must be positive"),
        price: z.number().nonnegative("Price can't be negative"),
      })
    )
    .min(1, "At least one item is required"),
  status: z.enum(["pending", "assigned", "delivered", "cancelled"], {
    errorMap: () => ({ message: "Invalid order status" }),
  }),
  scheduledFor: z.string().min(1, "Scheduled time is required"),
  assignedTo: z.string().optional(),
  totalAmount: z.number().nonnegative("Total must be 0 or more"),
});
