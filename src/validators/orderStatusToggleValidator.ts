import { z } from "zod";

export const orderStatusToggleValidator = z.object({
    status: z.enum(['pending', 'assigned', 'picked', 'delivered','cancelled'])
})

export type OrderStatusToggleType = z.infer<typeof orderStatusToggleValidator>;