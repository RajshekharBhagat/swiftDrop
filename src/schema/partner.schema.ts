import { z } from "zod";

export const partnerSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  status: z.enum(['active', 'inactive']),
  areas: z.array(z.string().min(1)),
  shift: z.object({
    start: z.string().min(1),
    end: z.string().min(1),
  }),
}).refine((data) => {
  if(!data.shift.start || !data.shift.end) return true;
  return data.shift.start < data.shift.end
}, {
  message: 'Shift start time must be before shit end time.',
  path: ['shift.start']
});
